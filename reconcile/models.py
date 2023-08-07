from unittest.util import _MAX_LENGTH
from django.db import models

# Create your models here.

class KeyValueDataFrame(models.Model):
    file_name = models.CharField(max_length=200, default="NOFILENAME")
    sheet_name = models.CharField(max_length=50, default="Sheet1")
    key = models.CharField(max_length=200, default="No_Column_Header")
    val = models.CharField(max_length=500, default="No_Value")