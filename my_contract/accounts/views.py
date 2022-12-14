from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.models import User, Group, Permission
from accounts.forms import GroupForm, UserForm
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from accounts.serializers import GroupSerializer, PermissionSerializer, UserSerializer
from django.db.models import Q
# from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.hashers import make_password
from django.utils.timezone import make_aware
from my_contract.settings import TIME_ZONE
# from rest_framework.decorators import api_view
import json
import datetime
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
    # εΊεε
    serializer_class = UserSerializer

    def get(self, request):
        users = User.objects.get_queryset().order_by('id')
        page = request.GET.get('page', 1)
        page_size = request.GET.get('pageSize', None)

        if page_size is None:
            user_serializers = self.serializer_class(users, many=True)
        else:
            paginator = Paginator(users, page_size)

            try:
                page_obj = paginator.get_page(page)
            except PageNotAnInteger:
                page_obj = paginator.page(1)
            except EmptyPage:
                page_obj = paginator.page(paginator.num_pages)

            user_serializers = self.serializer_class(page_obj, many=True)

        return JsonResponse({
            "data": user_serializers.data,
            "count": len(users),
            'success': True
        })


class UserCreateView(APIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserSerializer
    model = User
    class_form = UserForm

    def get(self, request):
        # form = UserCreationForm()
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request):
        data = {}
        body = json.loads(request.body.decode('utf-8'))['request_params']
        # print(body)
        naive_datetimer = datetime.datetime.strptime(body['date_joined'],
                                                     '%Y-%m-%d %H:%M:%S')
        TIME_ZONE
        aware_datetimer = make_aware(naive_datetimer)
        body['password'] = make_password(body['password'])
        body['date_joined'] = aware_datetimer
        form = self.class_form(body)
        if form.is_valid():
            new_user = form.save(commit=False)
            new_user.save()
            form.save_m2m()
            data['success'] = True
            data['message'] = 'saved'
        else:
            for field, errors in form.errors.items():
                error = 'Field: {} Errors: {}'.format(field, ','.join(errors))
                data = {'success': False, 'message': error}

        return JsonResponse(data)


class UserUpdateView(APIView):
    model = User
    form_class = UserForm
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request, *args, **kwargs):
        form = self.form_class()
        data = {}
        group_obj = self.model.objects.get(pk=kwargs['pk'])
        body = json.loads(request.body.decode('utf-8'))['request_params']
        body.update({'password': make_password(body['password'])})
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


class UserDeleteView(APIView):
    model = User
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
        return super(UserDeleteView, self).dispatch(*args, **kwargs)

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


class UserDetailView(APIView):
    permission_classes = (IsAuthenticated, )
    serializers_class = UserSerializer
    model = User

    def get(self, request, pk):
        try:
            users = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            raise Http404

        user_serializers = self.serializers_class(users)

        return JsonResponse({
            "user_obj": user_serializers.data,
            'success': True,
        })


class UserSearchView(APIView):
    permission_classes = (IsAuthenticated, )
    user_serializers = UserSerializer
    model = User

    def get(self, request):
        search_string = request.GET.get('q', None)
        if search_string:
            users = self.model.objects.filter(
                Q(username=search_string)).order_by('id')
            count = self.model.objects.filter(
                Q(username=search_string)).count()
        else:
            users = []
            count = 0

        page = request.GET.get('page', 1)
        page_size = request.GET.get('pageSize', None)

        if page_size is None:
            page_size = 10

        paginator = Paginator(users, page_size)

        try:
            page_obj = paginator.get_page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

        sa = self.user_serializers(users, many=True)

        return JsonResponse({
            "users": sa.data,
            "count": count,
            'success': True,
        })


class GroupListView(APIView):
    permission_classes = (IsAuthenticated, )
    # ζ°ζ?εΊεε
    serializer_for_group = GroupSerializer

    def get(self, request):
        group_obj = Group.objects.get_queryset().order_by('id')
        page = request.GET.get('page', 1)
        page_size = request.GET.get('pageSize', None)

        if page_size is None:
            serializer = self.serializer_for_group(group_obj, many=True)
        else:
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
            if form.is_valid():
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


class GroupDetailView(APIView):
    permission_classes = (IsAuthenticated, )
    group_serializers = GroupSerializer

    def get(self, request, pk):
        try:
            groups = Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            raise Http404

        group_serializers = self.group_serializers(groups, many=True)

        return JsonResponse({
            "groups": group_serializers.data,
            "count": len(groups),
            'success': True,
        })


class GroupSearchView(APIView):
    permission_classes = (IsAuthenticated, )
    group_serializers = GroupSerializer
    model = Group

    def get(self, request):
        search_string = request.GET.get('q', None)
        if search_string:
            groups = self.model.objects.filter(
                Q(name=search_string)).order_by('id')
            count = self.model.objects.filter(Q(name=search_string)).count()
        else:
            groups = []
            count = 0

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

        sa = self.group_serializers(groups, many=True)

        return JsonResponse({
            "groups": sa.data,
            "count": count,
            'success': True,
        })


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated, )
    user_serializers = UserSerializer

    def get(self, request):
        user = User.objects.get(username=request.user.username)
        sa = self.user_serializers(user)
        if user:
            return JsonResponse(sa.data)
        else:
            return redirect('/api/login')
