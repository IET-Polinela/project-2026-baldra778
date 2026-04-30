from django.views.generic import TemplateView
from django.http import JsonResponse
from main_app.models import Report
from django.db.models import Count

class DashboardView(TemplateView):
    template_name = 'dashboard/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_reports'] = Report.objects.count()
        context['total_reported'] = Report.objects.filter(status='REPORTED').count()
        context['total_resolved'] = Report.objects.filter(status='RESOLVED').count()
        context['latest_reported'] = Report.objects.filter(status='REPORTED').order_by('-id')[:5]
        context['latest_resolved'] = Report.objects.filter(status='RESOLVED').order_by('-id')[:5]
        return context


def chart_data(request):
    # status distribution
    status_data = Report.objects.values('status').annotate(total=Count('id'))

    # category distribution
    category_data = Report.objects.values('category').annotate(total=Count('id'))

    # latest reports
    latest_reported = list(
        Report.objects.filter(status='REPORTED').order_by('-id')[:5].values()
    )

    latest_resolved = list(
        Report.objects.filter(status='RESOLVED').order_by('-id')[:5].values()
    )

    return JsonResponse({
        'status': list(status_data),
        'category': list(category_data),
        'reported': latest_reported,
        'resolved': latest_resolved
    })


def search_reports(request):
    query = request.GET.get('q', '')

    data = list(
        Report.objects.filter(title__icontains=query).values()
    )

    return JsonResponse({'results': data})


def detail_report(request, id):
    report = Report.objects.get(id=id)

    return JsonResponse({
        'title': report.title,
        'category': report.category,
        'status': report.status,
        'description': report.description,
        'location': report.location
    })