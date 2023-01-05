from rest_framework import serializers
from contract.models import Supplier, Contract, Attachment, Category


class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = '__all__'


class CategrySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = '__all__'

class ContractSerializer(serializers.ModelSerializer):
    suppliers = SupplierSerializer(read_only=True)
    categories = CategrySerializer(read_only=True)

    class Meta:
        model = Contract
        fields = '__all__'


class AttachmentSerializer(serializers.ModelSerializer):
    contracts = ContractSerializer(read_only=True, many=True)

    class Meta:
        model = Attachment
        fields = '__all__'
