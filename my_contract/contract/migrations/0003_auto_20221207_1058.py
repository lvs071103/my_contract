# Generated by Django 3.2.16 on 2022-12-07 02:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contract', '0002_attachment_contract'),
    ]

    operations = [
        migrations.RenameField(
            model_name='supplier',
            old_name='owner',
            new_name='manager',
        ),
        migrations.AlterField(
            model_name='supplier',
            name='tel',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='联系电话'),
        ),
    ]