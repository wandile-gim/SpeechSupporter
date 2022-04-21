import email
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from django.contrib.auth import authenticate
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator 
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from users.models import User
from rest_framework.exceptions import AuthenticationFailed

#모델 호출
User = get_user_model()
class UserRegisterSerializer(serializers.ModelSerializer):
    #profile_img = serializers.ImageField(use_url=True, required = False)

    class Meta:
        model = User
        fields = ['email', 'password', 'nick_name', 'wannabe', ]# , 'profile_img'
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
                '해당 유저 정보가 존재하지 않습니다.'
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
        fields = ['email', 'nick_name', 'wannabe', ]#'profile_img'

class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)
    profile_img = serializers.ImageField(use_url=True, required = False)

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({
                "password" : "비밀번호가 다릅니다."})
        return attrs

    def validate_old_password(self, value):
        #check user
        request = self.context.get('request')
        if request and hasattr(request, "user"):
            user = request.user

        if not user.check_password(value):
            raise serializers.ValidationError({
                "old_password" : "기존 비밀번호가 틀립니다."
            })
        return value

    class Meta:
        model = User
        fields = ['nick_name', 'wannabe', 'old_password', 'password', 'password2', 'profile_img']

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
    email = serializers.CharField(write_only=True, required=True)


    class Meta:
        fields = ['password', "email"]
    
    def validate(self, attrs):
        
            password = attrs.get('password')
           

            user = User.objects.get(email = attrs.get("email"))

            user.set_password(password) # 비밀번호 저장
            user.save()
            
            return user

    