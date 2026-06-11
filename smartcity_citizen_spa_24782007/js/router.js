// js/router.js
 
const routes = {
    '#login': `
        <div class="row justify-content-center mt-5">
            <div class="col-md-4 card shadow-sm border-0 p-4">
                <h4 class="text-center fw-bold mb-4">
                    <i class="bi bi-buildings-fill text-primary me-2"></i>Login Warga
                </h4>
                <form id="loginForm">
                    <div class="mb-3">
                        <input type="text" id="loginUsername" class="form-control"
                               placeholder="Username" required>
                    </div>
                    <div class="mb-3">
                        <input type="password" id="loginPassword" class="form-control"
                               placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 fw-bold">
                        <i class="bi bi-box-arrow-in-right me-2"></i>Masuk
                    </button>
                </form>
                <p class="text-center small text-muted mt-3 mb-0">
                    Belum punya akun? <a href="#register" class="text-decoration-none">Daftar sekarang</a>
                </p>
            </div>
        </div>
    `,

    '#register': `
        <div class="row justify-content-center mt-5">
            <div class="col-md-5 card shadow-sm border-0 p-4">
                <h4 class="text-center fw-bold mb-4">
                    <i class="bi bi-person-plus-fill text-primary me-2"></i>Daftar Akun Warga
                </h4>
                <form id="registerForm">
                    <div class="mb-3">
                        <label for="registerUsername" class="form-label small fw-semibold">Username</label>
                        <input type="text" id="registerUsername" class="form-control" placeholder="Masukkan username" required>
                    </div>
                    <div class="mb-3">
                        <label for="registerEmail" class="form-label small fw-semibold">Email</label>
                        <input type="email" id="registerEmail" class="form-control" placeholder="nama@email.com" required>
                    </div>
                    <div class="mb-3">
                        <label for="registerPassword" class="form-label small fw-semibold">Password</label>
                        <input type="password" id="registerPassword" class="form-control" placeholder="Minimal 8 karakter" required>
                    </div>
                    <div class="mb-3">
                        <label for="registerConfirmPassword" class="form-label small fw-semibold">Konfirmasi Password</label>
                        <input type="password" id="registerConfirmPassword" class="form-control" placeholder="Ulangi password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 fw-bold">
                        <i class="bi bi-person-check-fill me-2"></i>Daftar
                    </button>
                </form>
                <p class="text-center small text-muted mt-3 mb-0">
                    Sudah punya akun? <a href="#login" class="text-decoration-none">Masuk di sini</a>
                </p>
            </div>
        </div>
    `,
 
    '#dashboard': `
        <div class="row g-4">
 
            <!-- Sidebar Kiri: Tombol Laporan Baru + Rekap Status -->
            <aside class="col-12 col-lg-3">
                <div class="card border-0 p-3 shadow-sm sticky-top" style="top: 20px;">
                    <button type="button" class="btn btn-primary btn-lg w-100 fw-bold mb-4"
                            onclick="openCreateModal()">
                        <i class="bi bi-plus-circle-fill me-2"></i>Laporan Baru
                    </button>
 
                    <h6 class="fw-bold mb-3">
                        <i class="bi bi-graph-up-arrow me-2 text-primary"></i>Rekap Status
                    </h6>
                    <div class="list-group list-group-flush small">
                        <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><i class="bi bi-file-earmark-text me-2 text-secondary"></i>Draft Keluhan</span>
                            <span id="count-draft" class="badge bg-secondary rounded-pill">0</span>
                        </div>
                        <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><i class="bi bi-megaphone me-2 text-warning"></i>Total Diajukan</span>
                            <span id="count-reported" class="badge bg-warning rounded-pill text-dark">0</span>
                        </div>
                        <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><i class="bi bi-check2-circle me-2 text-info"></i>Terverifikasi</span>
                            <span id="count-verified" class="badge bg-info rounded-pill text-dark">0</span>
                        </div>
                        <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><i class="bi bi-gear-wide-connected me-2 text-primary"></i>Sedang Diproses</span>
                            <span id="count-progress" class="badge bg-primary rounded-pill">0</span>
                        </div>
                        <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><i class="bi bi-check-circle me-2 text-success"></i>Selesai Ditangani</span>
                            <span id="count-resolved" class="badge bg-success rounded-pill">0</span>
                        </div>
                    </div>
                </div>
            </aside>
 
            <!-- Konten Utama: Tab + Daftar Laporan + Pagination -->
            <section class="col-12 col-lg-6">
                <!-- Tab Switcher -->
                <ul class="nav nav-pills mb-3 bg-white p-2 rounded shadow-sm gap-2"
                    id="dashboardTabs" role="tablist">
                    <li class="nav-item flex-fill" role="presentation">
                        <button class="nav-link w-100 active fw-bold" id="my-reports-tab"
                                type="button" onclick="switchTab('my-reports')">
                            <i class="bi bi-person-vcard me-2"></i>Laporan Saya
                        </button>
                    </li>
                    <li class="nav-item flex-fill" role="presentation">
                        <button class="nav-link w-100 fw-bold" id="city-feed-tab"
                                type="button" onclick="switchTab('city-feed')">
                            <i class="bi bi-globe-asia-australia me-2"></i>Feed Kota
                        </button>
                    </li>
                </ul>
 
                <!-- Container kartu laporan -->
                <div id="reports-list-container" class="d-flex flex-column gap-3">
                    <div class="text-center p-5 text-muted">
                        <div class="spinner-border text-primary" role="status"></div>
                    </div>
                </div>
 
                <!-- Container tombol pagination -->
                <div id="pagination-container" class="mt-3"></div>
            </section>
 
            <!-- Sidebar Kanan: Pengumuman -->
            <aside class="col-12 col-lg-3 d-none d-lg-block">
                <div class="card border-0 p-3 shadow-sm sticky-top" style="top: 20px;">
                    <h6 class="fw-bold mb-3">
                        <i class="bi bi-info-circle-fill text-primary me-2"></i>Pengumuman Resmi
                    </h6>
                    <div class="alert alert-info border-0 small mb-0">
                        <strong>Pemeliharaan Sistem:</strong> Integrasi fitur unggah foto laporan
                        akan dijadwalkan pada rilis pembaruan berikutnya. Tatap muka web
                        dioptimalkan secara asinkron.
                    </div>
                </div>
            </aside>
 
        </div>
    `
};
 
function handleRouting() {
    const hash = window.location.hash || '#login';
    const contentDiv = document.getElementById('app-content');

    if (hash === '#dashboard' && !isLoggedIn()) {
        window.location.hash = '#login';
        return;
    }

    if (hash === '#login' && isLoggedIn()) {
        window.location.hash = '#dashboard';
        return;
    }

    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }

    contentDiv.innerHTML = routes[hash] || routes['#login'];

    if (hash === '#login' && typeof setupLoginForm === 'function') {
        setupLoginForm();
    } else if (hash === '#register' && typeof setupRegisterForm === 'function') {
        setupRegisterForm();
    } else if (hash === '#dashboard' && typeof loadDashboardData === 'function') {
        // Reset ke tab default setiap kali masuk dashboard
        loadDashboardData('my_reports', 1);
    }
}
 
window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', function() {
    handleRouting();
    if (typeof updateAuthUI === 'function') updateAuthUI();
});