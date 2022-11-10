from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from contract.models import Supplier
from django.core import serializers
from django.http import HttpResponse


class SupplierView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        queryset = Supplier.objects.all()
        queryset_json = serializers.serialize('json', queryset)
        return HttpResponse(queryset_json)
