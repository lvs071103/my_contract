from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core import serializers
from django.http import JsonResponse, Http404
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.models import User, Group, Permission
from accounts.forms import GroupForm
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from accounts.serializers import GroupSerializer, PermissionSerializer
# from rest_framework.decorators import api_view
import json
# Create your views here.


class PermissionListView(APIView):
    permission_classes = (IsAuthenticated, )
    my_model = Permission
    serializer_class = PermissionSerializer

    def get(self, request):
        permissions = self.my_model.objects.get_queryset().order_by('id')
        serializer = self.serializer_class(permissions, many=True)
        return JsonResponse({
            "permissions": serializer.data,
            "count": len(permissions),
            'success': True
        })


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

        return JsonResponse({
            "data": query_list,
            "count": len(users),
            'success': True
        })


class GroupListView(APIView):
    permission_classes = (IsAuthenticated, )
    # 数据序列化
    serializer_for_group = GroupSerializer

    def get(self, request):
        group_obj = Group.objects.get_queryset().order_by('id')
        page = request.GET.get('page', 1)
        page_size = request.GET.get('pageSize', None)

        if page_size is None:
            page_size = 10
        paginator = Paginator(group_obj, page_size)

        try:
            page_obj = paginator.get_page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

        serializer = self.serializer_for_group(page_obj, many=True)

        return JsonResponse({
            "groups": serializer.data,
            "count": len(group_obj),
            'success': True,
        })


class GroupCreateView(APIView):
    form_class = GroupForm
    permission_classes = (IsAuthenticated, )
    model = Group

    def get(self, request):
        # print(self.form_class())
        return JsonResponse({
            "message":
            'this is only {} request'.format(str(request.method).lower())
        })

    def post(self, request):
        data = {}
        body = json.loads(request.body.decode('utf-8'))
        try:
            Group.objects.get(name=body['name'])
            data = {
                'success': False,
                'message': '{} is exist!'.format(body['name']),
            }
        except Group.DoesNotExist:
            form = self.form_class(body)
            if form.is_valid:
                todo = form.save(commit=False)
                todo.save()
                form.save_m2m()
                data['success'] = True
                data['message'] = 'saved'
            else:
                for field, errors in form.errors.items():
                    error = 'Field: {} Errors: {}'.format(
                        field, ','.join(errors))
                    data = {'success': False, 'message': error}

        return JsonResponse(data)


class GroupUpdateView(APIView):
    my_module = Group
    form_class = GroupForm
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request, *args, **kwargs):
        form = self.form_class()
        data = {}
        group_obj = self.my_module.objects.get(pk=kwargs['pk'])
        body = json.loads(request.body.decode('utf-8'))
        form = self.form_class(data=body, instance=group_obj)
        if form.is_valid():
            form.save()
            data['success'] = True
            data['message'] = 'update!'
        else:
            for field, errors in form.errors.items():
                error = 'Field: {} Errors: {}'.format(field, ','.join(errors))
                data = {'success': False, 'message': error}

        return JsonResponse(data)


class GroupDeleteView(APIView):
    model = Group
    permission_classes = (IsAuthenticated, )
    http_method_names = ['get', 'post', 'delete']

    def dispatch(self, *args, **kwargs):
        method = self.request.POST.get('_method', '').lower()
        if method == 'get':
            return self.get(*args, **kwargs)
        if method == 'delete':
            return self.delete(*args, **kwargs)
        if method == 'post':
            return self.post(*args, **kwargs)
        return super(GroupDeleteView, self).dispatch(*args, **kwargs)

    def get(self, request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def delete(self, *args, **kwargs):
        try:
            get_object_or_404(self.model, pk=kwargs['pk']).delete()
        except self.model.DoesNotExist:
            raise Http404
        return JsonResponse({'success': True, 'message': 'deleted!'})

    def post(self, *args, **kwargs):
        try:
            get_object_or_404(self.model, pk=kwargs['pk']).delete()
        except self.model.DoesNotExist:
            raise Http404
        return JsonResponse({'success': True, 'message': 'deleted!'})


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
