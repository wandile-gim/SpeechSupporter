from collections import OrderedDict
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .serializers import *
from .models import *
from users.models import *
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt

from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import permission_classes, authentication_classes, api_view

from rest_framework.generics import ListAPIView, GenericAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status

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


# @csrf_exempt
# def post_list(request): # 커뮤니티 조회
#     if request.method == "GET":
#         query = Post.objects.all().order_by("create_dt").reverse()
#         serialzer = PostListSerializer(query, many=True)

#         return JsonResponse(serialzer.data, safe = False)


@permission_classes([IsAuthenticated])
class PostCreateAPIView(CreateAPIView):
    queryset = Post.objects.all()
    def get_queryset(self):
        return super().get_queryset().prefetch_related('tags', 'category')
    serializer_class = PostCreateSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            print(request.user)
            serializer.save(user=request.user)

        if serializer.errors:
            print(serializer.errors)
        return Response(status=status.HTTP_201_CREATED, data = {'message':"post created"})

# class CommentCreateAPIView(CreateAPIView):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer

class CommentCreateRetreiveAPIView(ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def perform_create(self, serializer):
        serializer = self.get_serializer(data=self.request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save(author_id = self.request.user.pk, post_id=self.kwargs.get('post_id'))
            return Response(status=status.HTTP_201_CREATED, data = {'data' : serializer.validated_data})

        if serializer.errors:
            print(serializer.errors)

    def get_queryset(self):
        super().get_queryset().filter(post_id = self.kwargs['post_id'])

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, many = True)
        return Response(serializer.data)
    

class PostRetreiveAPIView(RetrieveAPIView):
    serializer_class = PostDetailSerializer
    queryset = Post.objects.all().prefetch_related('tags', 'comment_set')

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.view_count += 1
        obj.save(update_fields=("view_count",))
        return super().retrieve(request,*args, **kwargs)


# class PostLikeAPIView(UpdateAPIView):
class PostLikeAPIView(GenericAPIView):
    queryset = Post.objects.all()
    #GET으로 처리함으로써 serializer는 삭제해도 됨.
    # serializer_class = PostLikeSerializer
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.like += 1
        instance.save()
        return Response(instance.like)
    #partial = True 전체의 데이터를 업데이트하지 않아도 됨
    #Patch method
    # def update(self, request, *args, **kwargs):
    #     partial = kwargs.pop('partial', False)
    #     instance = self.get_object()

    #     data = {'like' : instance.like+1}
    #     serializer = self.get_serializer(instance, data=data, partial=partial)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)

    #     return Response(serializer.data)
    #GET method

class PostUserSearchAPIView(GenericAPIView):
    serializer_class = PostUserSearchSerializer

    #posturl 테이블을 만들어서 해결.
    #
class CateTagAPIView(APIView):
    def get(self, request):
        cateList = Category.objects.all()
        tagList = Tag.objects.all()
        
        data = {
            'cateList': cateList,
            'tagList': tagList,
        }
        serializer = CateTagSerializer(instance = data)
        return Response(serializer.data)

#ListView Pagination
class PostPageNumberPagination(PageNumberPagination):
    page_size = 5

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('postList', data),
            ('pageCnt', self.page.paginator.num_pages),
            ('curPage', self.page.number)
        ]))
    # page_size_query_param = 'page_size'
    # max_page_size = 1000

class PostListAPIView(ListAPIView):
    queryset = Post.objects.all().order_by("create_dt").reverse()
    serializer_class = PostListSerializer
    pagination_class = PostPageNumberPagination

