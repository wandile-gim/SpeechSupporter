from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .serializers import *
from .models import *
from users.models import *
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt

from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import permission_classes, authentication_classes, api_view

from rest_framework.generics import GenericAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.response import Response


@csrf_exempt
def post_create(request): # 글쓰기 - 내용, 제목
    # if request.method == "GET":
        # return HttpResponse("Login Plz")
    if request.method == "POST":
        data = JSONParser().parse(request)
        
        data['user'] = request.session.get('user')
        print(data)
        serializer = PostCreateSerializer(data=data)
        print(serializer)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)


@csrf_exempt
def post_list(request): # 커뮤니티 조회
    if request.method == "GET":
        query = Post.objects.all().order_by("create_dt").reverse()
        serialzer = PostListSerializer(query, many=True)

        return JsonResponse(serialzer.data, safe = False)

# @permission_classes([IsAuthenticated])
class PostCreateAPIView(CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
        if serializer.errors:
            print(serializer.errors)
        return Response(serializer.data)

class CommentCreateAPIView(CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class PostRetreiveAPIView(RetrieveAPIView):
    serializer_class = PostDetailSerializer
    def get_queryset(self):
        return Post.objects.all().prefetch_related('tags', 'comment_set')

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.view_count += 1
        obj.save(update_fields=("view_count",))
        return super().retrieve(request,*args, **kwargs)

class PostLikeAPIView(UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostLikeSerializer

    #partial = True 전체의 데이터를 업데이트하지 않아도 됨
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        data = {'like' : instance.like+1}
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class PostUserSearchAPIView(GenericAPIView):
    serializer_class = PostUserSearchSerializer

    #posturl 테이블을 만들어서 해결.
    #