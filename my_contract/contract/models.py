from django.db import models

# Create your models here.


class Supplier(models.Model):
    name = models.CharField(verbose_name='名称', max_length=50)
    owner = models.CharField(verbose_name='负责人', max_length=50)
    tel = models.CharField(verbose_name='联系电话', max_length=20)
    desc = models.TextField(verbose_name='描述', blank=True, null=True)


class Contract(models.Model):
    name = models.CharField(verbose_name='名称', unique=True, max_length=50)
    create_datetime = models.DateTimeField(verbose_name='创建时间',
                                           blank=True,
                                           auto_now_add=True)
    start_datetime = models.DateTimeField(verbose_name='签约时间',
                                          blank=True,
                                          null=True)
    end_datetime = models.DateTimeField(verbose_name='结束时间',
                                        blank=True,
                                        null=True)
    purpose = models.TextField(verbose_name='用途', blank=True, null=True)
    suppliers = models.ForeignKey(Supplier,
                                  on_delete=models.CASCADE,
                                  blank=True,
                                  null=True)
    owner = models.CharField(max_length=50,
                             verbose_name='负责人',
                             null=True,
                             blank=True)


class Attachment(models.Model):
    file = models.FileField(upload_to="media/", null=True, blank=True)
    contracts = models.ForeignKey(Contract, on_delete=models.CASCADE)
