from django.contrib import admin
from django.urls import path, include
from users.views import *
app_name = 'users'
urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('edit/', UpdatePartialUserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('change_password/', ChangePasswordView.as_view()),
    path('test/', Test.as_view()),
    path('check_password/<uidb64>/<token>/', CheckPasswordToken.as_view(), name = 'reset_confirm'), # 이메일 확인 URL
    path('reset_password/', ResetPasswordView.as_view()), # 비밀번호 초기화 전 이메일 작성 화면
    path('set_password/', SetPasswordView.as_view()), # 비밀번호 초기화 화면
]