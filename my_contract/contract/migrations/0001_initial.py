# Generated by Django 4.1.2 on 2022-12-16 16:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='名称')),
                ('manager', models.CharField(max_length=50, verbose_name='负责人')),
                ('tel', models.CharField(blank=True, max_length=20, null=True, verbose_name='联系电话')),
                ('desc', models.TextField(blank=True, null=True, verbose_name='描述')),
            ],
        ),
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='名称')),
                ('types', models.CharField(choices=[('1', '合同'), ('2', '订单')], default='1', max_length=1)),
                ('price', models.IntegerField(default=0, verbose_name='价格')),
                ('create_datetime', models.DateTimeField(auto_now_add=True, null=True, verbose_name='创建时间')),
                ('start_datetime', models.DateTimeField(blank=True, null=True, verbose_name='签约时间')),
                ('end_datetime', models.DateTimeField(blank=True, null=True, verbose_name='结束时间')),
                ('purpose', models.TextField(blank=True, null=True, verbose_name='用途')),
                ('owner', models.CharField(max_length=50, verbose_name='负责人')),
                ('status', models.BooleanField(blank=True, default=False, null=True, verbose_name='状态')),
                ('suppliers', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='contract.supplier')),
            ],
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('doc_file', models.FileField(upload_to='documents/%Y/%m/%d/')),
                ('contracts', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='contract.contract')),
            ],
        ),
    ]
