# Generated by Django 3.2.16 on 2022-12-08 06:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contract', '0008_rename_file_attachment_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attachment',
            name='name',
            field=models.FileField(default='', upload_to='media/%Y/%m/%d/'),
            preserve_default=False,
        ),
    ]
