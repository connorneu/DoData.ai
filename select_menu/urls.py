from django.urls import path, include
from . import views
from django.urls import path
from . import views  
from django.conf.urls.static import static

urlpatterns = [
    path("select_menu/", views.select_menu, name="select_menu"),
    ]