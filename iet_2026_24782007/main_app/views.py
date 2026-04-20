from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from .models import Report
from .forms import ReportForm


def home(request):
    reports = Report.objects.all().order_by('-created_at')
    context = {
        'reports': reports,
        'page_name': 'Daftar Laporan',
        'breadcrumb': 'Home'
    }
    return render(request, 'main_app/home.html', context)


def reports_page(request):
    reports = Report.objects.all().order_by('-created_at')
    context = {
        'reports': reports,
        'page_name': 'Daftar Laporan',
        'breadcrumb': 'Reports'
    }
    return render(request, 'main_app/home.html', context)

def about_page(request):
    return render(request, 'main_app/about.html')


def contact_page(request):
    return render(request, 'main_app/contact.html')


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

def delete_report(request, report_id):
    report = get_object_or_404(Report, id=report_id)

    if request.method == 'POST':
        report.delete()
        messages.success(request, "Laporan berhasil dihapus")
        return redirect('home')

    return render(request, 'main_app/delete_report.html', {'report': report})


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