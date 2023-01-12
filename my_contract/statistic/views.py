from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User, Group
from contract.models import Contract, Supplier, Category
import datetime
from tools.price_sum import statistic_sum, format_data


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
        # 查出分类
        c_obj = Category.objects.filter(name__contains='合同')
        o_obj = Category.objects.filter(name__contains='订单')
        c_list = []
        o_list = []
        for c in c_obj:
            c_list.append(c.id)
        for o in o_obj:
            o_list.append(o.id)
        current_year = datetime.datetime.now().strftime("%Y")
        # 查询分类包含合同字样的所有对象
        contract = Contract.objects.filter(categories__in=c_list,start_date__contains=current_year)
        # 查询分类包含订单字样的所有对象
        order = Contract.objects.filter(categories__in=o_list, start_date__contains=current_year)
        contract_list = []
        order_list = []
        for item in contract:
            contract_list.append({item.start_date.strftime("%Y-%m"): item.price})
        for item in order:
            order_list.append({item.start_date.strftime("%Y-%m"): item.price})
            
        # 进行累加统计
        c_list = format_data(statistic_sum(contract_list), '合同')
        o_list = format_data(statistic_sum(order_list), '订单')
        data = c_list + o_list

        return Response({"success": True, "message": 'OK', 'data': data})
