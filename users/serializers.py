from dataclasses import fields
from importlib.metadata import requires
from wsgiref import validate
from wsgiref.validate import validator
from argon2 import PasswordHasher
from attr import field
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from django.contrib.auth import authenticate
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator 
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from users.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from users.utils import Util
from rest_framework.exceptions import AuthenticationFailed

#모델 호출
User = get_user_model()
class UserRegisterSerializer(serializers.ModelSerializer):
    profile_img = serializers.ImageField(use_url=True, required = False)

    class Meta:
        model = User
        fields = ['email', 'password', 'nick_name', 'wannabe', 'profile_img']
        #Body에 시리얼라이즈 결과로 나오지 않음
        extra_kwargs = {
            'password' : {'write_only' : True}
        }
# JWT 사용을 위한 설정
JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password", None)
        # 사용자 아이디와 비밀번호로 로그인 구현(<-> 사용자 아이디 대신 이메일로도 가능)
        user = authenticate(email=email, password=password)

        if user is None:
            user = User.objects.filter(email=email).first()
            if user is None :
                raise serializers.ValidationError('user not found')
            if not user.check_password(password):
                raise serializers.ValidationError('password not matched')

        # if user is None:
        #     return {'id': 'None','email':email}
        try:
            payload = JWT_PAYLOAD_HANDLER(user) # payload 생성
            jwt_token = JWT_ENCODE_HANDLER(payload) # jwt token 생성
            update_last_login(None, user)

        except User.DoesNotExist:
            raise serializers.ValidationError(
                'User with given username and password does not exist'
            )
        return {
            'email':user.email,
            'token': jwt_token
        }
    # def create(self, validated_data):
    #     password = validated_data.pop('password', None)
    #     instance = self.Meta.model(**validated_data)
    #     if password is not None:
    #         #Hashing set_password
    #         instance.set_password(password)
    #     instance.save()
    #     return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'nick_name', 'wannabe', 'image_field']

class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['old_password', 'password', 'password2']
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({
                "password" : "Password field are not pair"})
        return attrs

    def validate_old_password(self, value):
        #check user
        request = self.context.get('request')
        if request and hasattr(request, "user"):
            user = request.user

        if not user.check_password(value):
            raise serializers.ValidationError({
                "old_password" : "Old password is not correct"
            })
        return value

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        fields = ['email']


class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    token = serializers.CharField(write_only=True, required=True)
    uidb64 = serializers.CharField(write_only=True, required=True)

    class Meta:
        fields = ['password', 'password2', 'token', 'uidb64']
    
    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64)) # uidb64에 id가 담겨져있다.
            user = User.objects.get(id = id)

            if not PasswordResetTokenGenerator().check_token(user, token): # 토큰이 만료되거나 인가되지 않는 사용자 제거
                raise AuthenticationFailed('The Reset Link is not valid, Plz try again new request', 401)
            
            if password != password2:
                raise serializers.ValidationError({
                    "password" : "Password field are not pair"})

            user.set_password(password) # 비밀번호 저장
            user.save()
            
            return user

        except Exception as e:
            raise AuthenticationFailed('The Reset Link is not valid, Plz try again new request', 401)
