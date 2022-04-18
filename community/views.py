from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from yaml import serialize
from .serializers import *
from .models import *
from users.models import *
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def posting(request): # 글쓰기 - 내용, 제목
    if request.method == "GET":
        return HttpResponse("Login Plz")
    elif request.method == "POST":
        data = JSONParser().parse(request)
        
        data['user'] = request.session.get('user')
        serializer = PostSerializer(data=data)
        print(serializer)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)


@csrf_exempt
def post_list(request): # 커뮤니티 조회
    if request.method == "GET":
        query = Post.objects.all().order_by("create_dt").reverse()
        serialzer = PostingSerializer(query, many=True)

        return JsonResponse(serialzer.data, safe = False)

@csrf_exempt
def post(request): # 글 조회 -> 글 ID가 넘어온다는 가정 하에
    if request.method == "GET":
        return HttpResponse("Login Plz")
    elif request.method == "POST":
        data = JSONParser().parse(request)
        
        obj = Post.objects.get(id = data['id'])
        obj.view_count += 1 # 조회수 증가
        obj.save()

        comments = Comment.objects.filter(post_id = data['id']) # 해당 글의 댓글 가져오기

        data = {}
        
        for index, comment in enumerate(comments):
            tmp = {}
            tmp['id'] = comment.id
            tmp['content'] = comment.content
            tmp['create_dt'] = comment.create_dt
            tmp['content'] = comment.post_id
            data['comment' + str(index)] = tmp
        
        data['id'] = obj.id
        data['title'] = obj.title
        data['content'] = obj.content
        data['create_dt'] = obj.create_dt
        data['like'] = obj.like
        data['view_count'] = obj.view_count
    
        return JsonResponse({"RESULT" : data}, status = 200)

