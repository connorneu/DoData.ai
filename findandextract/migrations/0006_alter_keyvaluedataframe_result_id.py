# Generated by Django 4.2.7 on 2024-04-30 02:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('findandextract', '0005_keyvaluedataframe_uid_keyvaluedataframe_result_uid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='keyvaluedataframe_result',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
