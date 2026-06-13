const API_URL = '/api';

const api = {
    async request(endpoint, method = 'GET', body = null) {
        const headers = {
            'Content-Type': 'application/json'
        };

        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },

    getProducts() {
        return this.request('/products');
    },

    getProduct(id) {
        return this.request(`/products/${id}`);
    },

    login(username, password) {
        return this.request('/auth/login', 'POST', { username, password });
    },

    register(username, email, password) {
        return this.request('/auth/register', 'POST', { username, email, password });
    },

    verifySession() {
        return this.request('/auth/verify', 'GET');
    },

    checkout(items, total) {
        return this.request('/orders/checkout', 'POST', { items, total });
    }
};
