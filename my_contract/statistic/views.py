from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User, Group
from contract.models import Contract, Supplier
import datetime


class SumStatisticView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request):
        user_count = len(User.objects.all())
        group_count = len(Group.objects.all())
        supplier_count = len(Supplier.objects.all())
        contract_count = len(Contract.objects.all())

        content = {
            'users': user_count,
            'groups': group_count,
            'suppliers': supplier_count,
            'contracts': contract_count
        }
        return Response(content)


class ContractStatisticView(APIView):
    permission_classes = (IsAuthenticated, )

    @staticmethod
    def get(request):
        data = []
        current_year = datetime.datetime.now().strftime("%Y")
        contract = Contract.objects.filter(types='1', start_datetime__contains=current_year)
        order = Contract.objects.filter(types='2', start_datetime__contains=current_year)
        contract_list = []
        order_list = []
        for item in contract:
            contract_list.append(item.start_datetime.strftime("%Y-%m"))
        for item in order:
            order_list.append(item.start_datetime.strftime("%Y-%m"))

        for m in range(1, 13):
            if m < 10:
                m = '0{}'.format(m)
            data.append({
                '数量': contract_list.count('{}-{}'.format(current_year, m)),
                'name': '合同',
                '月份': str(m)
            })

        for m in range(1, 13):
            if m < 10:
                m = '0{}'.format(m)
            data.append({
                '数量': order_list.count('{}-{}'.format(current_year, m)),
                'name': '订单',
                '月份': str(m),
            })

        return Response({"success": True, "message": 'OK', 'data': data})
