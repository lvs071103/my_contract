from django.urls import path, re_path
from contract import views

urlpatterns = [
    path('category/list', 
         views.CategoryListView.as_view(), 
         name='category_list'),
    path('category/add', 
         views.CategoryCreateView.as_view(), 
         name='category_add'),
    re_path(r'category/edit/(?P<pk>\d+)$', 
            views.CategoryUpdateView.as_view(), 
            name='category_update'),
    re_path(r'category/detail/(?P<pk>\d+)$', 
            views.CategoryDetailView.as_view(), 
            name='category_detail'),
    re_path(r'category/delete/(?P<pk>\d+)$', 
            views.CategoryDeleteView.as_view(), 
            name='category_delete'),
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
    re_path(r'contract/detail/(?P<pk>\d+)$',
            views.ContractDetailView.as_view(),
            name='contract_detail'),
    path('contract/getTypes',
         views.GetContractTypeView.as_view(),
         name='get_contract_types'),
    path('attachments/upload',
         views.AttachmentUploadView.as_view(),
         name='attachments_upload'),
    re_path(r'attachments/delete/(?P<pk>\d+)$',
            views.AttachmentDeleteView.as_view(),
            name='attachments_delete'),
    path('contract/publish',
         views.ContractCreateView.as_view(),
         name='contract_add'),
    re_path(r'contract/edit/(?P<pk>\d+)$',
            views.ContractUpdateView.as_view(),
            name='contract_edit'),
    re_path(r'contract/delete/(?P<pk>\d+)$',
            views.ContractDeleteView.as_view(),
            name='contract_delete')
]
