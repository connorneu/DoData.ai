from unittest.util import _MAX_LENGTH
from django.db import models

# Create your models here.

class KeyValueDataFrame(models.Model):
    file_name = models.CharField(max_length=200, default="NOFILENAME")
    sheet_name = models.CharField(max_length=100, default="Sheet1")
    key = models.CharField(max_length=200, default="No_Column_Header")
    val = models.TextField()

    def __str__(self):
        return self.file_name

class DataFilters(models.Model):
    primary_file_name = models.CharField(max_length=200, default="NOFILENAME")
    primary_sheet_name = models.CharField(max_length=100, default="Sheet1")
    primary_header_row = models.CharField(max_length=2, default="0")
    primary_conditions = models.TextField(null=True)
    secondary_file_name = models.CharField(max_length=200, default="NOFILENAME")
    secondary_sheet_name = models.CharField(max_length=100, default="Sheet1")
    secondary_header_row = models.CharField(max_length=2, default="0")
    secondary_conditions = models.TextField(null=True)                                                                            

    def __str__(self):
        return self.primary_file_name

