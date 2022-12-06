from django.urls import path
from contract import views

urlpatterns = [
    path('supplier/list/',
         views.SupplierListView.as_view(),
         name='supplier_list'),
]
