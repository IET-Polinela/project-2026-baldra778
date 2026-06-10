// js/app.js

let currentActiveTab = 'my_reports';
let currentPage = 1;

// --- 1. Fungsi Utama Penarik Data dari API ---
async function loadDashboardData(tab = currentActiveTab, page = currentPage) {
    currentActiveTab = tab;
    currentPage = page;

    const container = document.getElementById('reports-list-container');
    if (!container) return;

    container.innerHTML = `<div class="text-center p-5 text-muted"><div class="spinner-border text-primary" role="status"></div></div>`;

    try {
        const response = await requestAPI(`/api/report/?tab=${tab}&page=${page}`, 'GET');

        if (response.status === 200) {
            const data = await response.json();
            const reports = data.results ?? [];
            const totalCount = data.count ?? 0;
            const totalPages = Math.ceil(totalCount / 10);

            renderReportCards(reports);
            renderPagination(totalPages, page);
            loadSummaryStats();

        } else if (response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('access');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('refresh');
            if (typeof updateAuthUI === 'function') updateAuthUI();
            if (window.location.hash !== '#login') {
                window.location.hash = '#login';
            }
            return;
        } else {
            container.innerHTML = `<div class="alert alert-danger">Gagal mengambil data laporan dari server.</div>`;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `<div class="alert alert-danger">Koneksi ke backend server gagal.</div>`;
    }
}

// --- 2. Fungsi Rekap Status Sidebar (Bypass Pagination) ---
async function loadSummaryStats() {
    try {
        const response = await requestAPI('/api/report/?tab=my_reports&page_size=1000', 'GET');
        if (response.status === 200) {
            const data = await response.json();
            const reports = data.results ?? [];

            const countDraft      = reports.filter(r => r.status === 'DRAFT').length;
            const countReported   = reports.filter(r => r.status === 'REPORTED').length;
            const countVerified   = reports.filter(r => r.status === 'VERIFIED').length;
            const countInProgress = reports.filter(r => r.status === 'IN_PROGRESS').length;
            const countResolved   = reports.filter(r => r.status === 'RESOLVED').length;

            if (document.getElementById('count-draft')) {
                document.getElementById('count-draft').innerText      = countDraft;
                document.getElementById('count-reported').innerText   = countReported;
                document.getElementById('count-verified').innerText   = countVerified;
                document.getElementById('count-progress').innerText   = countInProgress;
                document.getElementById('count-resolved').innerText   = countResolved;
            }
        }
    } catch (error) {
        console.error("loadSummaryStats Error:", error);
    }
}

// --- 3. Render Pagination ---
function renderPagination(totalPages, currentPage) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let html = `<nav><ul class="pagination justify-content-center mt-3">`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <button class="page-link" onclick="loadDashboardData('${currentActiveTab}', ${i})">${i}</button>
        </li>`;
    }
    html += `</ul></nav>`;
    container.innerHTML = html;
}

// --- 4. Render Cards ---
function renderReportCards(reports) {
    const container = document.getElementById('reports-list-container');
    if (!container) return;

    if (reports.length === 0) {
        container.innerHTML = `
            <div class="card border-0 p-5 shadow-sm text-center text-muted">
                <i class="bi bi-inbox fs-1"></i>
                <h5 class="mt-3">Belum ada data laporan keluhan.</h5>
            </div>`;
        return;
    }

    let cardsHTML = '';
    reports.forEach(report => {
        let progressBarWidth = '10%';
        let progressBarColor = 'bg-secondary';
        let statusBadgeColor = 'bg-secondary';

        if (report.status === 'REPORTED') {
            progressBarWidth = '35%'; progressBarColor = 'bg-warning'; statusBadgeColor = 'bg-warning text-dark';
        } else if (report.status === 'VERIFIED') {
            progressBarWidth = '55%'; progressBarColor = 'bg-info'; statusBadgeColor = 'bg-info text-dark';
        } else if (report.status === 'IN_PROGRESS') {
            progressBarWidth = '75%'; progressBarColor = 'bg-primary'; statusBadgeColor = 'bg-primary';
        } else if (report.status === 'RESOLVED') {
            progressBarWidth = '100%'; progressBarColor = 'bg-success'; statusBadgeColor = 'bg-success';
        }

        let actionButtonsHTML = '';
        if (report.is_owner && report.status === 'DRAFT') {
            actionButtonsHTML = `
                <div class="d-flex justify-content-end gap-2 mt-2 pt-2 border-top border-light">
                    <button class="btn btn-sm btn-outline-primary"
                        onclick="openEditModal(${report.id}, '${escapeJSString(report.title)}', '${escapeJSString(report.description)}', '${escapeJSString(report.location || '')}', '${escapeJSString(report.category || 'Lainnya')}')">
                        <i class="bi bi-pencil-square me-1"></i>Edit Draft
                    </button>
                </div>`;
        }

        cardsHTML += `
            <div class="card border-0 shadow-sm overflow-hidden mb-1">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge ${statusBadgeColor} fw-bold">${report.status}</span>
                        <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>${new Date(report.updated_at).toLocaleDateString('id-ID')}</small>
                    </div>
                    <h5 class="card-title fw-bold text-dark">${report.title}</h5>
                    <p class="card-text text-secondary small">${report.description}</p>
                    <div class="mt-3">
                        <div class="d-flex justify-content-between small text-muted mb-1">
                            <span>Progress Penanganan:</span>
                            <span class="fw-bold">${progressBarWidth}</span>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated ${progressBarColor}"
                                role="progressbar" style="width: ${progressBarWidth}"></div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                        <span class="small text-muted">
                            <i class="bi bi-person-circle me-1 text-primary"></i>Oleh: <strong>${report.reporter}</strong>
                        </span>
                    </div>
                    ${actionButtonsHTML}
                </div>
            </div>`;
    });

    container.innerHTML = cardsHTML;
}

// --- 5. Tab Switcher ---
function switchTab(tabName) {
    currentActiveTab = tabName;
    currentPage = 1;

    document.getElementById('my-reports-tab').classList.toggle('active', tabName === 'my-reports');
    document.getElementById('city-feed-tab').classList.toggle('active', tabName === 'city-feed');

    // mapping nama tab HTML ke parameter API
    const tabParam = tabName === 'my-reports' ? 'my_reports' : 'feed';
    loadDashboardData(tabParam, 1);
}

// --- 6. Modal: Buat Laporan Baru ---
function openCreateModal() {
    document.getElementById('reportId').value = '';
    document.getElementById('reportTitle').value = '';
    document.getElementById('reportDescription').value = '';
    document.getElementById('reportLocation') && (document.getElementById('reportLocation').value = '');
    document.getElementById('reportCategory') && (document.getElementById('reportCategory').value = 'Infrastruktur');
    document.getElementById('reportStatus').value = 'DRAFT';
    const verifyBox = document.getElementById('reportVerify');
    if (verifyBox) verifyBox.checked = false;
    document.getElementById('reportModalLabel').innerText = 'Buat Keluhan Laporan Baru';
    new bootstrap.Modal(document.getElementById('reportModal')).show();
}

// --- 7. Modal: Edit Draft ---
function openEditModal(id, title, description, location, category) {
    document.getElementById('reportId').value = id;
    document.getElementById('reportTitle').value = title;
    document.getElementById('reportDescription').value = description;
    document.getElementById('reportLocation') && (document.getElementById('reportLocation').value = location);
    document.getElementById('reportCategory') && (document.getElementById('reportCategory').value = category || 'Lainnya');
    document.getElementById('reportStatus').value = 'DRAFT';
    const verifyBox = document.getElementById('reportVerify');
    if (verifyBox) verifyBox.checked = false;
    document.getElementById('reportModalLabel').innerText = 'Modifikasi Data Draft Keluhan';
    new bootstrap.Modal(document.getElementById('reportModal')).show();
}

// --- 8. Submit Form Modal (POST / PUT) ---
document.addEventListener('submit', async function(e) {
    if (!e.target || e.target.id !== 'reportForm') return;

    e.preventDefault();

    const reportId    = document.getElementById('reportId').value;
    const title       = document.getElementById('reportTitle').value.trim();
    const description = document.getElementById('reportDescription').value.trim();
    const location    = document.getElementById('reportLocation') ? document.getElementById('reportLocation').value.trim() : '-';
    const status      = document.getElementById('reportStatus').value;

    if (!title || !description) {
        alert('Judul dan Deskripsi wajib dilengkapi!');
        return;
    }

    const verifyBox = document.getElementById('reportVerify');
    if (verifyBox && !verifyBox.checked) {
        alert('Silakan centang verifikasi data sebelum menyimpan laporan.');
        return;
    }

    const category = document.getElementById('reportCategory') ? document.getElementById('reportCategory').value : 'Lainnya';
    const payload = { title, description, location, category, status };
    const url    = reportId ? `/api/report/${reportId}/` : '/api/report/';
    const method = reportId ? 'PUT' : 'POST';

    try {
        const response = await requestAPI(url, method, payload);

        if (response.status === 200 || response.status === 201) {
            const modalElement = document.getElementById('reportModal');
            bootstrap.Modal.getInstance(modalElement).hide();
            document.getElementById('reportForm').reset();
            alert(reportId ? 'Sukses memperbarui berkas draf!' : 'Sukses mengirimkan laporan baru!');
            loadDashboardData(currentActiveTab, currentPage);
        } else {
            const err = await response.json();
            alert('Gagal: ' + JSON.stringify(err));
        }
    } catch (error) {
        alert('Terjadi kesalahan sistem.');
    }
});

function escapeJSString(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}