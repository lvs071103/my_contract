from django.urls import path
from accounts import views

urlpatterns = [
    path('user/list', views.UserListView.as_view(), name='user_list'),
    path('group/list', views.GroupListView.as_view(), name='user_list'),
    path('user/profile', views.UserProfileView.as_view(), name='user_profile'),
]
