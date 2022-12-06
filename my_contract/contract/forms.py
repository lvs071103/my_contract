from django import forms
from contract.models import Supplier


class SupplierForm(forms.ModelForm):

    class Meta:
        model = Supplier
        fields = "__all__"
