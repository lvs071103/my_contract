from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from contract.serializers import SupplierSerializer
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from contract.models import Supplier
from contract.forms import SupplierForm
from django.http import JsonResponse, Http404
from django.core import serializers
from django.http import HttpResponse
import json


class SupplierListView(APIView):
    permission_classes = (IsAuthenticated, )
    model = Supplier
    serializer_class = SupplierSerializer

    def get(self, request):
        supplier_obj = Supplier.objects.get_queryset().order_by('id')
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

    def get(self, request):
        return JsonResponse({
            "message":
            "this is only {} request".format(str(request.method).lower()),
        })

    def post(self, request):
        body = json.loads(request.body.decode('utf-8'))['request_params']
