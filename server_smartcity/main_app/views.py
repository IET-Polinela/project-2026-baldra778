from collections import Counter

from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Report
from .forms import ReportForm


def admin_required(view_func):
    """Decorator: hanya Admin yang boleh akses view ini."""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "Silakan login terlebih dahulu.")
            return redirect('login')
        if not request.user.is_admin:
            messages.error(request, "Akses Ditolak! Fitur ini hanya untuk Admin.")
            return redirect('home')
        return view_func(request, *args, **kwargs)
    return wrapper


def home(request):
    reports = Report.objects.all().order_by('-created_at')
    status_counts = Counter(report.status for report in reports)
    context = {
        'reports': reports,
        'status_counts': status_counts,
        'page_name': 'Daftar Laporan',
        'breadcrumb': 'Home'
    }
    return render(request, 'main_app/home.html', context)


def reports_page(request):
    reports = Report.objects.all().order_by('-created_at')
    status_counts = Counter(report.status for report in reports)
    context = {
        'reports': reports,
        'status_counts': status_counts,
        'page_name': 'Daftar Laporan',
        'breadcrumb': 'Reports'
    }
    return render(request, 'main_app/home.html', context)

def about_page(request):
    return render(request, 'main_app/about.html')


def contact_page(request):
    return render(request, 'main_app/contact.html')


@admin_required
def add_report(request):
    if request.method == 'POST':
        form = ReportForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Laporan berhasil ditambahkan")
            return redirect('home')
    else:
        form = ReportForm()

    context = {
        'form': form,
        'page_name': 'Tambah Laporan',
        'breadcrumb': 'Tambah'
    }

    return render(request, 'main_app/report_form.html', context)

@admin_required
def edit_report(request, report_id):
    report = get_object_or_404(Report, id=report_id)

    if request.method == 'POST':
        form = ReportForm(request.POST, instance=report)
        if form.is_valid():
            form.save()
            messages.success(request, "Laporan berhasil diperbarui")
            return redirect('home')
    else:
        form = ReportForm(instance=report)

    context = {
        'form': form,
        'page_name': 'Edit Laporan',
        'breadcrumb': 'Edit'
    }

    return render(request, 'main_app/report_form.html', context)

def detail_report(request, report_id):
    report = get_object_or_404(Report, id=report_id)

    context = {
        'report': report,
        'page_name': 'Detail Laporan',
        'breadcrumb': 'Detail'
    }

    return render(request, 'main_app/detail_report.html', context)

@admin_required
def delete_report(request, report_id):
    report = get_object_or_404(Report, id=report_id)

    if request.method == 'POST':
        report.delete()
        messages.success(request, "Laporan berhasil dihapus")
        return redirect('home')

    return render(request, 'main_app/delete_report.html', {'report': report})


@admin_required
def change_status(request, report_id, new_status):
    report = get_object_or_404(Report, id=report_id)

    valid_transitions = {
        'REPORTED': 'VERIFIED',
        'VERIFIED': 'IN_PROGRESS',
        'IN_PROGRESS': 'RESOLVED',
    }

    if report.status in valid_transitions:
        if valid_transitions[report.status] == new_status:
            report.status = new_status
            report.save()
            messages.success(request, f"Status diubah ke {new_status}")

    return redirect('home')


def search_reports(request):
    """API untuk Live Search - Return JSON list of matching reports"""
    query = request.GET.get('q', '').strip()
    
    if not query:
        return JsonResponse({'results': []})
    
    # Search di title, location, category, dan description
    reports = Report.objects.filter(
        title__icontains=query
    ) | Report.objects.filter(
        location__icontains=query
    ) | Report.objects.filter(
        category__icontains=query
    )
    
    results = []
    for report in reports[:10]:  # Limit 10 hasil
        results.append({
            'id': report.id,
            'title': report.title,
            'category': report.category,
            'location': report.location,
            'status': report.status,
        })
    
    return JsonResponse({'results': results})


def detail_report_api(request, report_id):
    """API untuk Detail Modal - Return JSON report data"""
    try:
        report = Report.objects.get(id=report_id)
        return JsonResponse({
            'success': True,
            'id': report.id,
            'title': report.title,
            'category': report.category,
            'location': report.location,
            'status': report.status,
            'description': report.description,
            'created_at': report.created_at.strftime('%d %b %Y, %H:%M'),
        })
    except Report.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Laporan tidak ditemukan'
        }, status=404)