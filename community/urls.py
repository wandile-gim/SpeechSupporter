from django.contrib import admin
from django.urls import path, include
from community.views import CommentCreateAPIView, PostCreateAPIView, PostRetreiveAPIView, PostLikeAPIView, post_create, post_list
app_name = 'post'
urlpatterns = [
    path('post/', PostCreateAPIView.as_view()), 
    path('postlist/', post_list), 
    path('<int:pk>/', PostRetreiveAPIView.as_view()),
    path('comment/', CommentCreateAPIView.as_view()), 
    path('<int:pk>/like/', PostLikeAPIView.as_view()), 
]