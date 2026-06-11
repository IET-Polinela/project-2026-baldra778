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
        event.preventDefault();

        const usernameInput = document.getElementById('loginUsername').value;
        const passwordInput = document.getElementById('loginPassword').value;

        const payload = {
            username: usernameInput,
            password: passwordInput
        };

        try {
            const response = await requestAPI('/api/token/', 'POST', payload);

            if (response.status === 200) {
                const data = await response.json();

                localStorage.setItem('access_token', data.access);
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('refresh', data.refresh);

                alert('Login Berhasil!');
                updateAuthUI();

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

function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (!username || !email || !password) {
            alert('Username, email, dan password wajib diisi.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Konfirmasi password tidak cocok.');
            return;
        }

        try {
            const response = await requestAPI('/api/register/', 'POST', {
                username,
                email,
                password
            });

            if (response.status === 200 || response.status === 201) {
                alert('Pendaftaran berhasil! Silakan login dengan akun baru Anda.');
                window.location.hash = '#login';
                return;
            }

            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.username?.[0] ||
                errorData.email?.[0] ||
                errorData.password?.[0] ||
                errorData.detail ||
                'Pendaftaran gagal. Periksa kembali data yang Anda masukkan.';

            alert(errorMessage);
        } catch (error) {
            console.error('Register error:', error);
            alert('Terjadi kesalahan sistem saat mencoba mendaftar.');
        }
    });
}