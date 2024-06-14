from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("", views.register, name="register"),
    path("registered", views.registered, name="registered"),
    path("authenticate", views.authenticator, name="authenticator")
]
