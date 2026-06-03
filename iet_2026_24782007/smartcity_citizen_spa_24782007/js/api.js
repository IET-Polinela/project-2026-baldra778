// js/api.js

const BASE_URL = 'http://127.0.0.1:8000'; // Sesuaikan dengan URL server Django kamu

async function requestAPI(endpoint, method = 'GET', bodyData = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    // Ambil token dari localStorage secara otomatis jika ada [cite: 117]
    const accessToken = localStorage.getItem('access_token') || localStorage.getItem('access');
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`; // [cite: 117]
    }

    const config = {
        method: method,
        headers: headers
    };

    if (bodyData && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(bodyData);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        return response;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}