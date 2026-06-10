// js/auth.js

function getStoredAccessToken() {
    return localStorage.getItem('access_token') || localStorage.getItem('access');
}

function isLoggedIn() {
    return Boolean(getStoredAccessToken());
}

function updateAuthUI() {
    const statusLabel = document.getElementById('authStatusLabel');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navRegisterBtn = document.getElementById('navRegisterBtn');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    if (!statusLabel || !navLoginBtn || !navRegisterBtn || !navLogoutBtn) return;

    if (isLoggedIn()) {
        statusLabel.textContent = 'Sudah Login';
        statusLabel.className = 'badge bg-success text-white';
        navLoginBtn.classList.add('d-none');
        navRegisterBtn.classList.add('d-none');
        navLogoutBtn.classList.remove('d-none');
    } else {
        statusLabel.textContent = 'Belum Login';
        statusLabel.className = 'badge bg-light text-dark';
        navLoginBtn.classList.remove('d-none');
        navRegisterBtn.classList.remove('d-none');
        navLogoutBtn.classList.add('d-none');
    }
}

function logoutUser() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('refresh');
    updateAuthUI();
    window.location.hash = '#login';
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // [cite: 119] Mencegah reload halaman bawaan browser

        const usernameInput = document.getElementById('loginUsername').value;
        const passwordInput = document.getElementById('loginPassword').value;

        const payload = {
            username: usernameInput,
            password: passwordInput
        };

        try {
            // [cite: 120] Kirim permintaan POST ke endpoint JWT token Django
            const response = await requestAPI('/api/token/', 'POST', payload);

            if (response.status === 200) {
                const data = await response.json();
                
                //  Simpan token JWT ke localStorage
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('refresh', data.refresh);

                alert('Login Berhasil!');
                updateAuthUI();

                //  Pindahkan rute halaman ke dashboard secara instan
                setTimeout(() => {
                    updateAuthUI();
                    window.location.hash = '#dashboard';
                }, 0);
            } else {
                let message = 'Login Gagal! Periksa kembali username dan password Anda.';
                try {
                    const errorData = await response.json();
                    if (errorData.detail) {
                        message = `Login Gagal: ${errorData.detail}`;
                    }
                } catch (err) {
                    console.error('Response parse error', err);
                }
                alert(message);
            }
        } catch (error) {
            alert('Terjadi kesalahan sistem saat mencoba login.');
        }
    });
}