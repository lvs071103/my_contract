from django.db import models

# Create your models here.


class Supplier(models.Model):
    name = models.CharField(verbose_name='名称', max_length=50)
    owner = models.CharField(verbose_name='负责人', max_length=50)
    tel = models.CharField(verbose_name='联系电话', max_length=20)
    desc = models.TextField(verbose_name='描述', blank=True, null=True)
