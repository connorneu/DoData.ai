from django.db import models

# Create your models here.
class Employee(models.Model):       
    Empcode = models.CharField(max_length=10, default='')
    firstName = models.CharField(max_length=150,null=True)

    def __str__(self):
        return self.firstName
