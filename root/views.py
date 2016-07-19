import json

from django.http import HttpResponse, HttpRequest
from django.shortcuts import render

from django.core.mail import EmailMessage
from json import loads

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Create your views here.
def index(request):
    return render(request, 'index.html')

def cost_detail(request):
    return render(request, 'cost_of_sprint.html')

@csrf_exempt
@require_http_methods(['OPTIONS', 'GET'])
def get_properties():
    myprops = {}
    with open('./config.properties', 'r') as f:
        for line in f:
            line = line.rstrip()  # removes trailing whitespace and '\n' chars

            if "=" not in line: continue  # skips blanks and comments w/o =
            if line.startswith("#"): continue  # skips comments which contain =

            k, v = line.split("=", 1)
            myprops[k] = v
    return HttpRequest(myprops)

@csrf_exempt
@require_http_methods(['POST', 'OPTIONS', 'GET'])
def jira_send_email(request):
    data = loads(request.body.decode('utf-8') or '{}')
    user = data['user']
    email = EmailMessage('Hello {0}'.format(user['displayName']), 'Body goes here', user['emailAddress'],
                         ['to1@example.com'], ['bcc@example.com'],
                         reply_to=['another@example.com'], headers={'Message-ID': 'foo'})
    email.attach('invoice.txt', "<h3>{0}</h3>".format(data['metrics']), 'text/html')
    try:
        email.send(fail_silently=False)
        return HttpResponse(json.dumps(
            {'status': 'OK', 'message': 'Your Mail has been sent successfully :)'}))
    except ConnectionRefusedError:
        print('erro')
        return HttpResponse(json.dumps(
            {'status': 'ERROR', 'message': 'Your Mail has not been sent :('}))