from urllib import response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from users.models import User
from users.serializers import UserSerializer
import jwt, datetime
# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        seriallizer = UserSerializer(data=request.data)

        seriallizer.is_valid(raise_exception=True)
        seriallizer.save()

        return Response(seriallizer.data)

class LoginView(APIView):
    def post(self, request): 
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User Not Found')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        payload = {
            'email' : user.email,
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat' : datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        
        response = Response()
        #프론트엔드에 보여지는 것을 막고, 백엔드에서만 사용하기 위해 토큰을 쿠키에 저장
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt' : token
        }
        return response

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(email = payload['email']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message' : 'success'
        }
        return response
