from asyncore import read
from dataclasses import fields
from importlib.metadata import files
from django.forms import CharField
from rest_framework import serializers

from users.serializers import UserSerializer
from .models import *

class PostCreateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ['id','user','title', 'category', 'content']

class PostListSerializer(serializers.ModelSerializer):
    def get__user(self, obj):
        return str(obj.user)

    class Meta:
        model = Post 
        fields = ['id', 'user', 'title', 'category','content', 'create_dt', 'like', 'view_count']

class PostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
    
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post 
        fields = ['like']

class PostUserSearchSerializer(serializers.ModelSerializer):
    postlink = serializers.URLField(read_only=True)

    class Meta:
        model = Post
        fields = ['user', 'title', '']