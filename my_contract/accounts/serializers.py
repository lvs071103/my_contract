from rest_framework import serializers
from django.contrib.auth.models import Group, Permission, User


class PermissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(read_only=True, many=True)

    class Meta:
        model = Group
        fields = ('id', 'name', 'permissions')


class UserSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = '__all__'
