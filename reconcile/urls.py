from django.urls import path, include
from . import views
from django.urls import path
from . import views  
from django.conf.urls.static import static

urlpatterns = [
    path("reconcile", views.reconcile, name="reconcile"),
    path("reconcile_data_upload", views.reconcile_data_upload, name="reconcile_data_upload"),
    ]