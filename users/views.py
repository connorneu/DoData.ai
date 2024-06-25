from django.shortcuts import render
#from django.http import HttpResponse
import logging
from django.contrib.auth.models import User
import traceback
from django.shortcuts import redirect
#from django.http import HttpResponseRedirect
#from django.urls import reverse
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user
from django.contrib import messages
#from django_email_verification import send_email
from django.contrib.auth import logout

# Create your views here.

log = logging.getLogger(__name__)

def index(request):
    return render(request, 'index.html', {})


def login(request):
    warning = ''
    print('fuicking log in')
    print('this should never run')
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
        # REACTIVATE WHEN DEBUG EQUALS FALSE
        # U DIDNT FINNISH CONFIGURING THIS - restricting to accounts that click on link works
        # IN CONSOLE LINK APPEARS BUT NO EMAIL HAS EVER BEEN SENT
        #user.is_active = False  # Example
        #send_email(user)
        user.first_name = name.split()[0]
        if len(name.split()) > 1:
            user.last_name = name.split()[1:]
        user.save()
        print('success reg')
        return render(request, "registered.html", {})
    except Exception:
        traceback.print_exc()
        messages.error(request,'Email already has an account')
        return render(request, "register.html", {})
    
def authenticator(request):
    print("this is the user")
    u = request.POST['email']
    p = request.POST['password']
    print('name:', u, 'password:', p)
    user = authenticate(username=u, password=p)
    print("THISIS THE USER")
    print(user)
    if user.is_authenticated:
        print('ur authenticated')
        print(user)
        print(request.user)
        print(get_user(request))
        return redirect('findandextract') #redirect("findandextract/fandemain.html")
    else:
        print('ur not authenticated')
        warning = 'Username password combination do not exist'
        return render(request, "login.html", {'no_access':warning})

def log_out(request):
    print('logging out')
    logout(request)
    return render(request, "logged_out.html", {})

        
    


