from django.urls import path, include
from . import views

from django.urls import path
from . import views  
#from Import_Excel import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.home, name="home"),
    path("data", views.Import_Excel_pandas,name="Import_Excel_pandas"),
    ]