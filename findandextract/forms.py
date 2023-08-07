from django import forms
from .models import DataFilters

class DataFilters(forms.ModelForm):
    class Meta:
        model = DataFilters
        fields = '__all__'