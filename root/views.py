import json

from django.http import HttpResponse
from django.shortcuts import render

from django.core.mail import EmailMessage
from json import loads

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Create your views here.
def index(request):
    #return HttpResponse('Hello from Python!')
    return render(request, 'index.html')

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