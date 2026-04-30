from django.urls import path
from .views import *

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('data/', chart_data, name='chart_data'),
    path('search/', search_reports, name='search'),
    path('detail/<int:id>/', detail_report, name='detail'),
]