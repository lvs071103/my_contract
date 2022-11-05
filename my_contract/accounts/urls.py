from django.urls import path
from accounts import views

urlpatterns = [
    path('list/', views.UserListView.as_view(), name='user_list'),
]
