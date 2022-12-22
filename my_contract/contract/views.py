from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from contract.serializers import SupplierSerializer, ContractSerializer, AttachmentSerializer
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from contract.models import Supplier, Contract, Attachment
from contract.forms import SupplierForm, AttachmentForm, ContractForm
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
# from django.core import serializers
# from django.http import HttpResponse
import os
import json
import datetime
from tools.remove_file import remove
from my_contract.settings import MEDIA_ROOT
from django.utils.timezone import make_aware
from my_contract.settings import TIME_ZONE
# from django.db.models import Q
from tools.transfer_string_date import transfer


class SupplierListView(APIView):
    permission_classes = (IsAuthenticated, )
    model = Supplier
    serializer_class = SupplierSerializer

    def get(self, request):
        supplier_obj = self.model.objects.get_queryset().order_by('id')
        page = request.GET.get('page', 1)
        page_size = request.GET.get('pageSize', None)

        if page_size is None:
            supplier_serializers = self.serializer_class(supplier_obj,
                                                         many=True)
        else:
            paginator = Paginator(supplier_obj, page_size)

            try:
                page_obj = paginator.get_page(page)
            except PageNotAnInteger:
                page_obj = paginator.page(1)
            except EmptyPage:
                page_obj = paginator.page(paginator.num_pages)

            supplier_serializers = self.serializer_class(page_obj, many=True)

        return JsonResponse({
            "data": supplier_serializers.data,
            "count": len(supplier_obj),
            'success': True
        })


class SupplierCreateView(APIView):
    permission_classes = (IsAuthenticated, )
    model = Supplier
    form_class = SupplierForm

    @staticmethod
    def get(request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request):
        data = {}
        body = json.loads(request.body.decode('utf-8'))['request_params']
        form = self.form_class(body)
        if form.is_valid():
            form.save()
            data['success'] = True
            data['message'] = 'saved'
        else:
            for field, errors in form.errors.items():
                error = 'Field: {} Errors: {}'.format(field, ','.join(errors))
                data = {'success': False, 'message': error}

        return JsonResponse(data)


class SupplierDetailView(APIView):
    permission_classes = (IsAuthenticated, )
    serializers_class = SupplierSerializer
    model = Supplier

    def get(self, request, pk):
        try:
            suppliers = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            raise Http404

        supplier_serializers = self.serializers_class(suppliers)

        return JsonResponse({
            "supplier_obj": supplier_serializers.data,
            'success': True,
        })


class SupplierUpdateView(APIView):
    model = Supplier
    form_class = SupplierForm
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request, pk):
        data = {}
        supplier_obj = self.model.objects.get(pk=pk)
        body = json.loads(request.body.decode('utf-8'))['request_params']
        form = self.form_class(data=body, instance=supplier_obj)
        if form.is_valid():
            form.save()
            data['success'] = True
            data['message'] = 'update!'
        else:
            for field, errors in form.errors.items():
                error = 'Field: {} Errors: {}'.format(field, ','.join(errors))
                data = {'success': False, 'message': error}

        return JsonResponse(data)


class SupplierDeleteView(APIView):
    model = Supplier
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
        return super(SupplierDeleteView, self).dispatch(*args, **kwargs)

    @staticmethod
    def get(request):
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


class ContractListView(APIView):
    permission_classes = (IsAuthenticated, )
    model = Contract
    serializer_class = ContractSerializer

    def get(self, request):
        queryset = self.model.objects.get_queryset().order_by('id')
        page = request.GET.get('page', 1)
        page_size = request.GET.get('pageSize', None)
        status = request.GET.get('status', None)
        start_datetime = request.GET.get('start_datetime', None)
        end_datetime = request.GET.get('end_datetime', None)
        type_id = request.GET.get('type_id', None)
        if status == '0':
            status = False
        else:
            status = True
        if start_datetime and end_datetime and type_id:
            TIME_ZONE
            new_start = make_aware(transfer(start_datetime))
            new_end = make_aware(transfer(end_datetime))
            queryset = self.model.objects.filter(
                status=status, 
                types=type_id, 
                start_datetime__gte=new_start, 
                end_datetime__lte=new_end).order_by('id')
            queryset_serializers = self.serializer_class(queryset, many=True)
        elif page_size is None:
            queryset_serializers = self.serializer_class(queryset, many=True)
        else:
            paginator = Paginator(queryset, page_size)
            try:
                page_obj = paginator.get_page(page)
            except PageNotAnInteger:
                page_obj = paginator.page(1)
            except EmptyPage:
                page_obj = paginator.page(paginator.num_pages)
            queryset_serializers = self.serializer_class(page_obj, many=True)
        return JsonResponse({
            "data": queryset_serializers.data,
            "count": len(queryset),
            'success': True
        })


class ContractCreateView(APIView):
    permission_classes = (IsAuthenticated, )
    model = Contract
    form_class = ContractForm

    def get(self, request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request):
        data = {}
        body = json.loads(request.body.decode('utf-8'))
        body['create_datetime'] = datetime.datetime.now()
        if 'dragger' in body.keys():
            file_list = body['dragger']
        else:
            file_list = []
        form = self.form_class(body)
        if form.is_valid():
            obj = form.save()
            if file_list:
                for f in file_list:
                    Attachment.objects.filter(pk=f['response']['pk']).update(
                        contracts_id=obj.pk)
            data['success'] = True
            data['message'] = 'saved'
        else:
            for field, errors in form.errors.items():
                error = 'Field: {} Errors: {}'.format(field, ','.join(errors))
                data = {'success': False, 'message': error}

        return JsonResponse(data)


class GetContractTypeView(APIView):
    permission_classes = (IsAuthenticated, )
    model = Contract

    def get(self, request):
        type_list = []
        for c in self.model.types.field.choices:
            element = dict()
            element['id'] = c[0]
            element['name'] = c[1]
            type_list.append(element)

        return JsonResponse({'types': type_list})


class ContractDetailView(APIView):
    permission_classes = (IsAuthenticated, )
    serializers_class = ContractSerializer
    model = Contract

    def get(self, request, pk):
        try:
            queryset = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            raise Http404

        contract_serializers = self.serializers_class(queryset)
        attachments = []
        for item in queryset.attachment_set.all():
            attachments.append({
                'id': item.id,
                'doc_file': item.doc_file.name,
                'name': os.path.basename(item.doc_file.name),
                'response': {
                    'pk': item.id
                },
                'url': "http://" + request.META['HTTP_HOST'] + item.doc_file.url,
                'status':'done',
                'uid': item.id,
                'linkProps': '{"download": "file"}'
            })

        return JsonResponse({
            "data": contract_serializers.data,
            "fileList": attachments,
            'success': True,
        })


class ContractUpdateView(APIView):
    model = Contract
    form_class = ContractForm
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request, pk):
        data = {}
        queryset = self.model.objects.get(pk=pk)
        body = json.loads(request.body.decode('utf-8'))
        file_list = body['dragger']
        form = self.form_class(data=body, instance=queryset)
        if form.is_valid():
            obj = form.save()
            for f in file_list:
                Attachment.objects.filter(pk=f['response']['pk']).update(
                    contracts_id=obj.pk)
            data['success'] = True
            data['message'] = 'update!'
        else:
            for field, errors in form.errors.items():
                error = 'Field: {} Errors: {}'.format(field, ','.join(errors))
                data = {'success': False, 'message': error}

        return JsonResponse(data)


class ContractDeleteView(APIView):
    model = Contract
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
        return super(ContractDeleteView, self).dispatch(*args, **kwargs)

    @staticmethod
    def get(request):
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


class AttachmentUploadView(APIView):
    permission_classes = (IsAuthenticated, )
    model = Attachment
    form_class = AttachmentForm
    queryset_serializer = AttachmentSerializer

    @staticmethod
    def get(request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request):
        data = {}
        form = self.form_class(request.POST, request.FILES)
        if form.is_valid():
            obj = form.save()
            data['success'] = True
            data['message'] = 'uploaded.'
            data['uid'] = obj.pk
            data['pk'] = obj.pk
            data['name'] = os.path.basename(obj.doc_file.name)
            data['url'] = request.META['HTTP_HOST'] + obj.doc_file.url
        else:
            for field, errors in form.errors.items():
                error = 'Field: {} Errors: {}'.format(field, ','.join(errors))
                data = {'success': False, 'message': error}

        return JsonResponse(data=data)


class AttachmentDeleteView(APIView):
    model = Attachment
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
        return super(AttachmentDeleteView, self).dispatch(*args, **kwargs)

    @staticmethod
    def get(request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def delete(self, *args, **kwargs):
        try:
            res = get_object_or_404(self.model, pk=kwargs['pk'])
            res.delete()
            file_path = os.path.join(MEDIA_ROOT,
                                     res.doc_file.name).replace('\\', '/')
            remove(file_path)
        except self.model.DoesNotExist:
            raise Http404
        return JsonResponse({'success': True, 'message': 'deleted!'})

    def post(self, *args, **kwargs):
        try:
            res = get_object_or_404(self.model, pk=kwargs['pk'])
            res.delete()
            file_path = os.path.join(MEDIA_ROOT,
                                     res.doc_file.name).replace('\\', '/')
            remove(file_path)
        except self.model.DoesNotExist:
            raise Http404
        return JsonResponse({'success': True, 'message': 'deleted!'})
