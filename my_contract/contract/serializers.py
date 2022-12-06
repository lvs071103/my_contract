from rest_framework import serializers
from contract.models import Supplier, Contract, Attachment


class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = '__all__'


class ContractSerializer(serializers.ModelSerializer):
    suppliers = SupplierSerializer(read_only=True, many=True)

    class Meta:
        mode = Contract
        fields = '__all__'


class AttachmentSerializer(serializers.ModelSerializer):
    contracts = ContractSerializer(read_only=True, many=True)

    class Meta:
        model = Attachment
        fields = '__all__'
