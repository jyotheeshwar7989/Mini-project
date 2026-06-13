// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Clear auth and redirect to login
const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

// In Docker (production): use /api/v1 → nginx proxies to backend
// In local development: use localhost:8080
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/v1'
    : 'http://localhost:8080/api/v1';

console.log('Environment:', process.env.NODE_ENV);
console.log('BASE_URL:', BASE_URL);

const API = {
    async request(method, url, data = null) {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = { method, headers };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`API ${method}: ${BASE_URL}${url}`);

            const response = await fetch(
                `${BASE_URL}${url}`,
                options
            );

            console.log(`Response status: ${response.status}`);

            if (response.status === 401) {
                clearAuth();
                return null;
            }

            const jsonData = await response.json();
            console.log('Response data:', jsonData);
            return jsonData;

        } catch (err) {
            console.error(`API Error ${method} ${url}:`, err);
            throw err;
        }
    },

    get(url) {
        return this.request('GET', url);
    },

    post(url, data) {
        return this.request('POST', url, data);
    },

    put(url, data) {
        return this.request('PUT', url, data);
    },

    delete(url) {
        return this.request('DELETE', url);
    }
};

export default API;