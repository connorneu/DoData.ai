from django.urls import path, include
from . import views
from django.urls import path
from . import views  
from django.conf.urls.static import static

urlpatterns = [
    path("", views.findandextract, name="findandextract"),
    # path("findandextract_data_upload/", views.findandextract_data_upload, name="findandextract_data_load"),
    ]