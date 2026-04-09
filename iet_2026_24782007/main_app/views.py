from django.urls import reverse_lazy
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.shortcuts import get_object_or_404, redirect
from .models import Report

# a. Menampilkan daftar laporan [cite: 40]
class ReportListView(ListView):
    model = Report
    template_name = 'main_app/home.html' # Sesuai file kamu: home.html
    context_object_name = 'reports'

# b. Detail laporan [cite: 41]
class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/detail_report.html'

# c. Membuat laporan baru [cite: 42]
class ReportCreateView(CreateView):
    model = Report
    fields = ['title', 'category', 'description', 'location']
    template_name = 'main_app/report_form.html'
    success_url = reverse_lazy('report_list')

# d. Mengedit laporan [cite: 43]
class ReportUpdateView(UpdateView):
    model = Report
    fields = ['title', 'category', 'description', 'location']
    template_name = 'main_app/report_form.html'
    success_url = reverse_lazy('report_list')

# e. Menghapus laporan [cite: 44]
class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

# View Khusus Update Status (Workflow) [cite: 52]
class ReportUpdateStatusView(View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk) 
        new_status = request.POST.get('status') 
        report.status = new_status 
        report.save() 
        return redirect('report_list')