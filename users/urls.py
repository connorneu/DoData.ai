from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("", views.index, name="index"),
    #path("register", views.register, name="register"),
    path("register", views.index, name="register"),
    #path("registered", views.registered, name="registered"),
    path("registered", views.index, name="registered"),
    #path("authenticate", views.authenticator, name="authenticator"),
    path("log_out", views.log_out, name="log_out")
]
