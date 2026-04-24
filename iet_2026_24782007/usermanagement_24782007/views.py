from django.urls import reverse_lazy
from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from .models import User, Report
from .forms import CitizenRegistrationForm

# --- AUTHENTICATION VIEWS ---
class UserLoginView(LoginView):
    template_name = 'login.html'
    def form_valid(self, form):
        messages.success(self.request, "Berhasil login! Selamat datang.")
        return super().form_valid(form)

class UserLogoutView(LogoutView):
    def dispatch(self, request, *args, **kwargs):
        messages.info(request, "Anda telah keluar dari sistem.")
        return super().dispatch(request, *args, **kwargs)

class RegisterView(CreateView):
    form_class = CitizenRegistrationForm
    template_name = 'register.html'
    success_url = reverse_lazy('login')
    def form_valid(self, form):
        messages.success(self.request, "Registrasi berhasil! Silakan login.")
        return super().form_valid(form)

# --- REPORT CRUD VIEWS (WITH ROLE PROTECTION) ---
class AdminRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not getattr(request.user, 'is_admin', False):
            messages.error(request, "Akses ditolak! Hanya Admin yang boleh mengakses fitur ini.")
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)

class ReportListView(ListView):
    model = Report
    template_name = 'main_app/home.html'
    context_object_name = 'reports'

class ReportCreateView(AdminRequiredMixin, CreateView):
    model = Report
    fields = ['title', 'description', 'status']
    template_name = 'report_form.html'
    success_url = reverse_lazy('report_list')

class ReportUpdateView(AdminRequiredMixin, UpdateView):
    model = Report
    fields = ['title', 'description', 'status']
    template_name = 'report_form.html'
    success_url = reverse_lazy('report_list')

class ReportDeleteView(AdminRequiredMixin, DeleteView):
    model = Report
    template_name = 'report_confirm_delete.html'
    success_url = reverse_lazy('report_list')