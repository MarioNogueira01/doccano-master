# Generated by Django 4.0.2 on 2022-04-05 02:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("examples", "0003_alter_example_filename"),
    ]

    operations = [
        migrations.AddField(
            model_name="example",
            name="upload_name",
            field=models.CharField(blank=True, max_length=512, null=True),
        ),
    ]
