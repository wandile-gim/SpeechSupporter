import imp
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

# from users.models import User
# User = get_user_model()
class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, blank=True, null=True)
    tags = models.ManyToManyField('Tag', blank=True)
    title = models.CharField('TITLE', max_length=50)
    description = models.CharField('DESCRIPTION', max_length=100, blank=True, help_text='simple one-line text.')
    #image = models.ImageField('IMAGE', upload_to='blog/%Y/%m/', blank=True, null=True)
    content = models.TextField('CONTENT')
    create_dt = models.DateTimeField('CREATE DT', auto_now_add=True)
    update_dt = models.DateTimeField('UPDATE DT', auto_now=True)
    like = models.PositiveSmallIntegerField('LIKE', default=0)
    view_count = models.PositiveSmallIntegerField('VIEW_COUNT', default=0)
    
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField('DESCRIPTION', max_length=100, blank=True, help_text='simple one-line text.')

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, blank=True, null=True)
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, null=True)
    content = models.TextField('CONTENT')
    create_dt = models.DateTimeField('CREATE DT', auto_now_add=True)
    update_dt = models.DateTimeField('UPDATE DT', auto_now=True)

    @property
    def short_content(self):
        return self.content[:10]

    def __str__(self):
        return self.short_content