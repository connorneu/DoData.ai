from django.urls import path, include
from . import views                                
from django.conf.urls.static import static

urlpatterns = [
    path("login", views.login, name="login"),
    ]