from django.db import models

# Create your models here.


class Supplier(models.Model):
    name = models.CharField(verbose_name='名称', max_length=50)
    manager = models.CharField(verbose_name='负责人', max_length=50)
    tel = models.CharField(verbose_name='联系电话',
                           max_length=20,
                           blank=True,
                           null=True)
    email = models.EmailField(verbose_name='邮件', max_length=20, blank=True, null=True)
    desc = models.TextField(verbose_name='描述', blank=True, null=True)
    
    
class Category(models.Model):
    name = models.CharField(verbose_name='名称', max_length=50)
    desc = models.TextField(verbose_name='备注', null=True, blank=True)


class Contract(models.Model):
    # TYPE_CHOICE = (
    #     ('1', '合同'),
    #     ('2', '订单'),
    # )
    contract_sn = models.CharField(verbose_name='合同编号', max_length=15, null=True)
    name = models.CharField(verbose_name='名称', unique=True, max_length=50)
    # types = models.CharField(max_length=1, choices=TYPE_CHOICE, default='1')
    categories = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)
    price = models.IntegerField(verbose_name='价格', default=0)
    create_datetime = models.DateTimeField(verbose_name='创建时间',
                                           blank=True,
                                           null=True,
                                           auto_now_add=True)
    start_date = models.DateField(verbose_name='签约时间', blank=True, null=True)
    end_date = models.DateField(verbose_name='结束时间', blank=True, null=True)
    purpose = models.TextField(verbose_name='用途', blank=True, null=True)
    suppliers = models.ForeignKey(Supplier,
                                  on_delete=models.CASCADE,
                                  blank=True,
                                  null=True)
    owner = models.CharField(max_length=50, verbose_name='负责人')
    status = models.BooleanField(verbose_name='状态',
                                 null=True,
                                 blank=True,
                                 default=False)


class Attachment(models.Model):
    doc_file = models.FileField(upload_to="documents/%Y/%m/%d/")
    contracts = models.ForeignKey(Contract,
                                  on_delete=models.CASCADE,
                                  blank=True,
                                  null=True)
