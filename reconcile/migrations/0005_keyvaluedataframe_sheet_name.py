# Generated by Django 3.2.18 on 2023-03-28 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reconcile', '0004_keyvaluedataframe_file_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='keyvaluedataframe',
            name='sheet_name',
            field=models.CharField(default='sheet1', max_length=50),
        ),
    ]
