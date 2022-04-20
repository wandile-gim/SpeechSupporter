from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, UpdateAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
#drf permission
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import permission_classes, authentication_classes, api_view

from rest_framework_jwt.settings import api_settings

from rest_framework import status

from users.models import User

from users.serializers import *
import jwt, datetime

from django.contrib.auth.tokens import PasswordResetTokenGenerator 
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from users.utils import Util

# class RegisterView(APIView):
#     def post(self, request):
#         seriallizer = UserRegisterSerializer(data=request.data)
#         #serializer (create) 메소드로 저장된 정보를 검사
#         if seriallizer.is_valid(raise_exception=True):
#             get_user_model().objects.create_user(**seriallizer.validated_data)
#             return Response(status= status.HTTP_201_CREATED)    
#         return Response(status= status.HTTP_400_BAD_REQUEST, data={'errors': seriallizer.errors})
@permission_classes([AllowAny])
class RegisterView(GenericAPIView):
    serializer_class = UserRegisterSerializer
    def post(self, request):
        seriallizer = self.get_serializer(data=request.data)
        #serializer (create) 메소드로 저장된 정보를 검사
        if seriallizer.is_valid(raise_exception=True):
            get_user_model().objects.create_user(**seriallizer.validated_data)
            return Response(status= status.HTTP_201_CREATED, data={'message': "user info has been created"})    
        return Response(status= status.HTTP_400_BAD_REQUEST, data={'errors': seriallizer.errors})

        # 아래는 serializer를 통해 구현한 사용자 생성 로직
        #serializer (create) 메소드로 저장된 정보를 저장
        # seriallizer.save()

        # return Response(seriallizer.data)

@permission_classes([AllowAny])
class LoginView(GenericAPIView):
    serializer_class = UserLoginSerializer
    def post(self, request, *args, **kwargs): 
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_409_CONFLICT, data = {'message':'check Email and Password'})
        
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        if user['email'] == "None":
            return Response(status=status.HTTP_401_UNAUTHORIZED, data={'message':"fail(email)"})
        
        #Customizing Response 
        response = Response()
        #프론트엔드에 보여지는 것을 막고, 백엔드에서만 사용하기 위해 토큰을 쿠키에 저장
        response.set_cookie(key='jwt', value=user['token'], httponly=True)

        response.data = {
            "email" : UserLoginSerializer(user,context=self.get_serializer_context()).data.get('email'),
            'message' : "token successfully created",
            'token' : user['token'],
            'login-status' : True
        }
        return response
        # email = request.data['email']
        # password = request.data['password']
        # user = User.objects.filter(email=email).first()

        # if user is None:
        #     return Response(status = status.HTTP_400_BAD_REQUEST, data = {'message' : 'user not found'})

        # if not user.check_password(password):
        #     return Response(status = status.HTTP_400_BAD_REQUEST, data = {'message' : 'password not matched'})

        # payload = {
        #     'email' : user.email,
        #     'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        #     'iat' : datetime.datetime.utcnow()
        # }
        # token = jwt.encode(payload, 'secret', algorithm='HS256')
        
        # response = Response()
        # #프론트엔드에 보여지는 것을 막고, 백엔드에서만 사용하기 위해 토큰을 쿠키에 저장
        # response.set_cookie(key='jwt', value=token, httponly=True)
        # response.data = {
        #     'email' : email,
        #     'jwt' : token
        # }
        # return response
JWT_DECODE_HANDLER = api_settings.JWT_DECODE_HANDLER
class UserView(APIView):
    def get(self, request):
        loggedin = False
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            # payload = jwt.decode(token, 'secret', algorithms='HS256')
            payload = JWT_DECODE_HANDLER(token)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(email = payload['email']).first()
        serializer = UserSerializer(user)
        if request.user.is_authenticated:
            loggedin = True
        context ={
            'user' :serializer.data,
            'login' : loggedin
        }
        # return Response(serializer.data)
        return Response(context)

#모든 유저 조회 뷰도 필요함.
@permission_classes([IsAuthenticated])
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message' : 'success'
        }
        return response


@permission_classes([IsAuthenticated])
class UpdatePartialUserView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        obj = queryset.get(pk=self.request.user.id)
        self.check_object_permissions(self.request, obj)
        return obj
    
    def retrieve(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(status=status.HTTP_200_OK, data = serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        self.object = self.get_object()
        serializer = self.get_serializer(request.user, data = request.data, partial=partial)
        # serializer = self.get_serializer(self.object, data = request.data, partial=partial)
        if not serializer.is_valid(raise_exception=True):
            return Response(status=status.HTTP_409_CONFLICT, data = {'message':serializer.errors})
        
        self.object.set_password(request.data['password'])
        self.object.save()

        return Response(status=status.HTTP_202_ACCEPTED, data={"message": "success!"})
        
@permission_classes([IsAuthenticated])
class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_409_CONFLICT, data = {'message': serializer.errors})

        self.object.set_password(request.data['password'])
        self.object.save()
        # instance.save()
        
        return Response({"message" : "password has been changed"}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated]) 
class Test(GenericAPIView):
    serializer_class = UserLoginSerializer
    def get(self, request, *args, **kwargs):
        return Response({'message':'good'}, status=status.HTTP_200_OK)

class ResetPasswordView(GenericAPIView): # 패스워드 초기화 1  - 이메일로 토큰, userID이 담긴 링크 전송 -> 이메일 필요
    serializer = ResetPasswordSerializer

    def post(self, request):

        serializer = self.serializer(data = request.data)

        email = request.data.get('email', '')

        if User.objects.filter(email=email).exists():

            user = User.objects.get(email = email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id)) # 안전한 url 생성
            token = PasswordResetTokenGenerator().make_token(user) # 토큰 생성
            current_site = get_current_site(request = request).domain 
            relativeLink = reverse(
                'users:reset_confirm', kwargs={'uidb64' : uidb64, 'token' : token })
            absurl = 'http://' + current_site + relativeLink # 비밀 번호 변경 토큰 URL 링크 생성
            email_body = 'Hi, ' + user.nick_name + '\n Thank you for Using Speech Supporter \n\n Use Link below to reset your password \n\n' + absurl
            
            data = {'email_body' : email_body, 'to_email' : user.email, # 전송 이메일 내용
                    'email_subject' : '[Team. AIVLE] Reset your Password'}
    
            Util.send_email(data) # 이메일 전송 - Gmail X

        else: # DB에 해당 이메일이 존재하지 않을 떄,
            return Response({"message" : "Invalid Email"}, status=status.HTTP_401_UNAUTHORIZED)

        serializer.is_valid(raise_exception=True)        

        # 이메일로 링크만 전송(링크에 토큰과 userID 포함)
        return Response({'message' : 'You can reset your password checking your email'}, status = status.HTTP_200_OK) 

class CheckPasswordToken(GenericAPIView): # 패스워드 초기화 2- 이메일 URL 클릭 시
    def get(self, request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id = id)

            if not PasswordResetTokenGenerator().check_token(user, token): # 토큰이 만료되거나 인가되지 않는 사용자
                return Response({"message" : "The Reset Link is not valid, Plz try again new request"}, status=status.HTTP_401_UNAUTHORIZED)

            # 토큰과 userID와 함께 비밀번호 설정 화면으로 전환(비밀번호 설정 화면은 추후 제작 필요)
            return Response({'success' : True, 'message' : 'Credentials Valid', 'uidb64' : uidb64, 'token' : token}, status=status.HTTP_200_OK)    

        except DjangoUnicodeDecodeError:
            if not PasswordResetTokenGenerator().check_token(user):
                return Response({"message" : "The Reset Link is not valid, Plz try again new request"}, status=status.HTTP_401_UNAUTHORIZED)

class SetPasswordView(UpdateAPIView): # 패스워드 초기화 3 - 토큰 확인 후 비밀번호 변경 -> 비밀번호1, 비밀번호2, 토큰, userID 필요
    serializer_class = SetPasswordSerializer
    
    def update(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response({"message" : "Password Rest Success!!"}, status=status.HTTP_200_OK)