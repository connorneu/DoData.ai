from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

# Create your views here.

def select_menu(request):
    context = {}
    return render(request, "select_menu/select_menu.html", context)