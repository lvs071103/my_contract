from django.urls import path, re_path
from contract import views

urlpatterns = [
    path('supplier/list/',
         views.SupplierListView.as_view(),
         name='supplier_list'),
    path('supplier/add',
         views.SupplierCreateView.as_view(),
         name='supplier_add'),
    re_path(r'supplier/edit/(?P<pk>\d+)$',
            views.SupplierUpdateView.as_view(),
            name='supplier_edit'),
    re_path(r'supplier/detail/(?P<pk>\d+)$',
            views.SupplierDetailView.as_view(),
            name='supplier_detail'),
    re_path(r'supplier/delete/(?P<pk>\d+)$',
            views.SupplierDeleteView.as_view(),
            name='supplier_delete'),
    path('contract/list',
         views.ContractListView.as_view(),
         name='contract_list'),
    path('contract/getTypes',
         views.GetContractTypeView.as_view(),
         name='get_contract_types'),
    path('attachments/upload',
         views.AttachmentUploadView.as_view(),
         name='attachments_upload'),
    path('contract/add',
         views.ContractCreateView.as_view(),
         name='contract_add')
]
