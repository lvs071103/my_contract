from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core import serializers
from django.http import HttpResponse
from django.contrib.auth.models import User
# Create your views here.


class UserListView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        content = User.objects.all()
        users_as_json = serializers.serialize('json', content)
        return HttpResponse(users_as_json)
