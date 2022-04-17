from django.db import models
from django.conf import settings
from community.models import Post
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(max_length=255, unique=True)
    nick_name = models.CharField(max_length=50)
    password = models.CharField(max_length=255, null=False)
    wannabe = models.CharField(max_length=50, null=False)
    profile_img = models.ImageField(null=True, upload_to="user/%Y/%m/")
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_activate = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password', 'nick_name', 'wannabe', 'profile_img']

    objects = UserManager()

    class Meta:
        ordering = ['-date_joined']

    def get_full_name(self):
        email = self.email.split('@')[0]
        return email + '/' +self.nick_name

    def __str__(self):
        return self.nick_name

class BookMark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, null=False, on_delete=models.CASCADE)
    create_dt = models.DateTimeField('CREATE DT', auto_now_add=True)

