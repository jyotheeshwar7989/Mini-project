import { getToken, clearAuth } from '../context/AuthContext';

// Explicit browser-to-backend routing to prevent Nginx loop drops
const BASE_URL = 'http://localhost:8080/api/v1';

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

        let response;
        try {
            console.log(`API ${method}: ${BASE_URL}${url}`);
            response = await fetch(`${BASE_URL}${url}`, options);
            console.log(`Response status: ${response.status}`);
        } catch (networkErr) {
            console.error(`Network Connection Failure on ${url}:`, networkErr);
            throw new Error('Cannot connect to server. Make sure the backend is running!');
        }

        if (response.status === 401) {
            clearAuth();
            window.location.href = '/login';
            return null;
        }

        const textData = await response.text();
        const jsonData = textData ? JSON.parse(textData) : {};

        if (!response.ok) {
            console.error(`API bad response state (${response.status}):`, jsonData);
            throw {
                status: response.status,
                message: jsonData?.message || jsonData?.error || 'Something went wrong processing your request.'
            };
        }

        console.log('Response data:', jsonData);
        return jsonData;
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