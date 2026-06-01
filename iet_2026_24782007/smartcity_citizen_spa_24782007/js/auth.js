// js/auth.js

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
                localStorage.setItem('refresh_token', data.refresh);

                alert('Login Berhasil!');
                
                //  Pindahkan rute halaman ke dashboard secara instan
                window.location.hash = '#dashboard';
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