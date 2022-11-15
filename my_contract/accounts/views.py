from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth.models import User, Group
from accounts.forms import GroupForm
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
import json
# Create your views here.


class UserListView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        query_list = []
        users = User.objects.get_queryset().order_by('id')
        page = request.GET.get('page', 1)
        page_size = request.GET.get('pageSize')
        paginator = Paginator(users, page_size)

        try:
            page_obj = paginator.get_page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

        users_as_json = serializers.serialize('json', page_obj)
        user_list = json.loads(users_as_json)

        for item in user_list:
            item['fields']['id'] = item['pk']
            query_list.append(item['fields'])

        print(query_list)
        return JsonResponse({
            "data": query_list,
            "count": len(users),
            'success': True
        })


class GroupListView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        query_list = []
        groups = Group.objects.get_queryset().order_by('id')
        page = request.GET.get('page', 1)
        page_size = request.GET.get('pageSize', None)
        if page_size is None:
            page_size = 10
        paginator = Paginator(groups, page_size)

        try:
            page_obj = paginator.get_page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

        groups_as_json = serializers.serialize('json', page_obj)
        group_lit = json.loads(groups_as_json)

        for item in group_lit:
            item['fields']['id'] = item['pk']
            query_list.append(item['fields'])

        return JsonResponse({
            "data": query_list,
            "count": len(groups),
            'success': True,
        })


class GroupFormView(APIView):
    form_class = GroupForm
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        # form = self.form_class()
        return JsonResponse({"message": "no post request!"})

    def post(self, request):
        data = {}
        body = json.loads(request.body.decode('utf-8'))
        try:
            Group.objects.get(name=body['name'])
            data = {
                'success': False,
                'message': '{} is exist!'.format(body['name']),
                'status': 500
            }
        except Group.DoesNotExist:
            form = self.form_class(body)
            if form.is_valid:
                form.save()
            data['success'] = True
            data['message'] = 'saved'

        return JsonResponse(data)


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
