# Generated by Django 3.2.16 on 2022-11-18 07:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_rename_userprofile_profile'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Profile',
        ),
    ]