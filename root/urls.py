from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.jira_send_email, name='sendemail'),
]