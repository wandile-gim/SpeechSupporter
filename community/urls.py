from django.contrib import admin
from django.urls import path, include
from community.views import PostLikeAPIView, CateTagAPIView, PostCreateAPIView, CommentCreateAPIView, PostListAPIView, PostRetreiveAPIView, PostLikeAPIView
app_name = 'post'
urlpatterns = [
    path('post/', PostCreateAPIView.as_view()), 
    path('postlist/', PostListAPIView.as_view()), 
    path('<int:pk>/', PostRetreiveAPIView.as_view()),
    # path('comment/', CommentCreateAPIView.as_view()), 
    path('<int:pk>/comment/', CommentCreateAPIView.as_view()), 
    path('<int:pk>/like/', PostLikeAPIView.as_view()), 
    path('catetag/', CateTagAPIView.as_view()), 
]