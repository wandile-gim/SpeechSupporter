from django.shortcuts import render
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
#drf permission
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import permission_classes, authentication_classes

from rest_framework import status

from users.models import User

from users.serializers import UserLoginSerializer, UserRegisterSerializer
import jwt, datetime


# class RegisterView(APIView):
#     def post(self, request):
#         seriallizer = UserRegisterSerializer(data=request.data)
#         #serializer (create) 메소드로 저장된 정보를 검사
#         if seriallizer.is_valid(raise_exception=True):
#             get_user_model().objects.create_user(**seriallizer.validated_data)
#             return Response(status= status.HTTP_201_CREATED)    
#         return Response(status= status.HTTP_400_BAD_REQUEST, data={'errors': seriallizer.errors})

class RegisterView(GenericAPIView):
    serializer_class = UserRegisterSerializer
    def post(self, request):
        seriallizer = self.get_serializer(data=request.data)
        #serializer (create) 메소드로 저장된 정보를 검사
        if seriallizer.is_valid(raise_exception=True):
            get_user_model().objects.create_user(**seriallizer.validated_data)
            return Response(status= status.HTTP_201_CREATED)    
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
        
        return Response(
            {
                 "email": UserLoginSerializer(
                     user,context=self.get_serializer_context()
                 ).data.get('email'), 
                 "token": user['token']
             }
        ) 
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

class UserView(APIView):
    def get(self, request):
        loggedin = False
        token = request.COOKIES.get('jwt')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(email = payload['email']).first()
        serializer = UserRegisterSerializer(user)
        if request.user.is_authenticated:
            loggedin = True
        context ={
            'user' :serializer.data,
            'login' : loggedin
        }
        # return Response(serializer.data)
        return Response(context)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message' : 'success'
        }
        return response


@permission_classes([IsAuthenticated]) 
class Test(GenericAPIView):
    serializer_class = UserLoginSerializer
    def get(self, request, *args, **kwargs):
        return Response({'message':'good'},status=status.HTTP_200_OK)