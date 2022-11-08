from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.contrib.auth.models import User
import json
# Create your views here.


class UserListView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        content = User.objects.all()
        users_as_json = serializers.serialize('json', content)
        return HttpResponse(users_as_json)


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
