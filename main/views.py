from sqlite3 import DatabaseError
from django.shortcuts import render
from django.http import HttpResponse
from .models import Employee
import pandas as pd
from django.core.files.storage import FileSystemStorage

# Create your views here.

def index(response, id):
    ls = Employee.objects.get(id=id)
    return render(response, "main/lists.html", {"ls":ls})

def home(response):
    return render(response, "main/home.html", {})

def Import_Excel_pandas(request):
    if request.method == 'POST' and request.FILES['myfile']:      
        myfile = request.FILES['myfile']
        fs = FileSystemStorage()
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = fs.url(filename)       
        print('urlQQ', uploaded_file_url)
        empexceldata = pd.read_csv(filename)       
        print(empexceldata)
    return render(request, 'main/import_excel_db.html',{})