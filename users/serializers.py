from dataclasses import field
from rest_framework import serializers

from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'nick_name', 'wannabe', 'profile_img']
        #Body에 시리얼라이즈 결과로 나오지 않음
        extra_kwargs = {
            'password' : {'write_only' : True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            #Hashing set_password
            instance.set_password(password)
        instance.save()
        return instance