from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth.models import User, Group
import json
# Create your views here.


class UserListView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        query_list = []
        users = User.objects.all()
        users_as_json = serializers.serialize('json', users)
        user_list = json.loads(users_as_json)
        for item in user_list:
            item['fields']['id'] = item['pk']
            query_list.append(item['fields'])

        return JsonResponse({
            "data": query_list,
            "count": len(query_list),
            'success': True
        })


class GroupListView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        query_list = []
        groups = Group.objects.all()
        groups_as_json = serializers.serialize('json', groups)
        group_lit = json.loads(groups_as_json)
        for item in group_lit:
            item['fields']['id'] = item['pk']
            query_list.append(item['fields'])
        print(query_list)
        return JsonResponse({
            "data": query_list,
            "count": len(query_list),
            'success': True,
        })


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        user = User.objects.get(username=request.user.username)
        if user:
            users_as_json = serializers.serialize('json', [
                user,
            ])
            elment = json.loads(users_as_json)[0]
            return JsonResponse(elment['fields'])
        else:
            return redirect('/api/login')
