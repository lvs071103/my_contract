from django.urls import path
from statistic import views

urlpatterns = [
    path('sum/', views.SumStatisticView.as_view(), name='statistic'),
    path('contracts/', views.ContractStatisticView.as_view(), name='contract_statistic'),
]
