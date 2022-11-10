from django.urls import path
from contract import views

urlpatterns = [
    path('supplier/list/', views.SupplierView.as_view(), name='supplier_list'),
]
