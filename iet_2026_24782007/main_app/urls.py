from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('reports/', views.reports_page, name='reports'),
    path('about/', views.about_page, name='about'),
    path('contacts/', views.contact_page, name='contacts'),

    path('add/', views.add_report, name='add_report'),
    path('edit/<int:report_id>/', views.edit_report, name='edit_report'),
    path('detail/<int:report_id>/', views.detail_report, name='detail_report'),
    path('delete/<int:report_id>/', views.delete_report, name='delete_report'),
    path(
        'change-status/<int:report_id>/<str:new_status>/',
        views.change_status,
        name='change_status'
    ),
]