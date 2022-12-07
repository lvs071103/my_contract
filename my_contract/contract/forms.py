from django import forms
from contract.models import Supplier, Attachment


class SupplierForm(forms.ModelForm):

    class Meta:
        model = Supplier
        fields = "__all__"


class AttachmentForm(forms.ModelForm):

    class Meta:
        model = Attachment
        fields = '__all__'
