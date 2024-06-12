from django.shortcuts import render
from django.http import HttpResponse
import logging
from django.contrib.auth.models import User
import traceback
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.urls import reverse

# Create your views here.

log = logging.getLogger(__name__)

def login(request):
    warning = ''
    return render(request, "login.html", {'no_access':warning})

def register(request):
    return render(request, "register.html", {})

def registered(request):
    try:
        print('start reg')
        name = request.POST['name']
        email = request.POST['email']
        password = request.POST['password']
        log.info(name + ' | ' + email + ' | ' + password)
        user = User.objects.create_user(username=email, email=email, password=password)
        user.first_name = name.split()[0]
        if len(name.split()) > 1:
            user.last_name = name.split()[1:]
        user.save()
        print('success reg')
        return render(request, "registered.html", {})
    except Exception:
        traceback.print_exc()
        return render(request, "register.html", {})
    
def authenticate(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('findandextract')) #redirect("findandextract/fandemain.html")
    else:
        warning = 'Username password combination do not exist'
        return render(request, "login.html", {'no_access':warning})

        
    


