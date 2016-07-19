from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

import root.views

# Examples:
# url(r'^$', 'export_metrics_jira.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^$', root.views.index, name='index'),
    url(r'^cost_of_sprint$', root.views.cost_detail, name='cost_detail'),
    url(r'^api/', include('root.urls')),
    url(r'^admin/', include(admin.site.urls)),
]
