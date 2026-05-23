from django.contrib import admin
from django.urls import path, include
from usermanagement_24782007.api_views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main_app.urls')),
    path('user/', include('usermanagement_24782007.urls')),
    path('dashboard/', include('dashboard_24782007.urls')),
    path('api/', include('main_app.api_urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
]