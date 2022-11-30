from django import forms
from django.contrib.auth.models import Group, User


class GroupForm(forms.ModelForm):

    class Meta:
        model = Group
        fields = '__all__'


class UserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = '__all__'
