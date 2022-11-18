from django.urls import path, re_path
# from django.contrib.auth.decorators import login_required
from accounts import views

urlpatterns = [
    path('permission/list',
         views.PermissionListView.as_view(),
         name='permission_list'),
    path('user/list', views.UserListView.as_view(), name='user_list'),
    path('group/list', views.GroupListView.as_view(), name='group_list'),
    path('group/add', views.GroupCreateView.as_view(), name='group_add'),
    re_path(r'group/delete/(?P<pk>\d+)$',
            views.GroupDeleteView.as_view(),
            name='group_delete'),
    re_path(r'group/edit/(?P<pk>\d+)$',
            views.GroupUpdateView.as_view(),
            name='group_edit'),
    path('user/profile', views.UserProfileView.as_view(), name='user_profile'),
]
