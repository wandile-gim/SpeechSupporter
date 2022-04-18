from dataclasses import fields
from rest_framework import serializers
from .models import *

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id','title', 'category', 'content']

class PostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post 
        fields = ['id', 'title', 'category','content', 'create_dt', 'like', 'view_count']

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