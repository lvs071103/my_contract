from django.urls import path
from accounts import views

urlpatterns = [
    path('user/list', views.UserListView.as_view(), name='user_list'),
    path('group/list', views.GroupListView.as_view(), name='group_list'),
    path('group/add', views.GroupFormView.as_view(), name='group_add'),
    path('user/profile', views.UserProfileView.as_view(), name='user_profile'),
]
