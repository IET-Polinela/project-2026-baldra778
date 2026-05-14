from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main_app.urls')),
    path('user/', include('usermanagement_24782007.urls')),
    path('dashboard/', include('dashboard_24782007.urls')),
    path('api/', include('main_app.api_urls')),
]