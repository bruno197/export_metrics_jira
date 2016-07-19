from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^sendemail', views.jira_send_email, name='sendemail'),
    url(r'^getproperties', views.get_properties, name='getproperties'),
]