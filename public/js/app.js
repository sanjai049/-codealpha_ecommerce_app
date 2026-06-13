const app = {
    state: {
        products: [],
        cart: [],
        user: null
    },

    async init() {
        // Load cart from local storage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.state.cart = JSON.parse(savedCart);
        }

        // Check authentication securely with backend verification
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const data = await api.verifySession();
                this.state.user = data.user;
            } catch (error) {
                // Token invalid or expired, clear local state
                localStorage.removeItem('token');
                localStorage.removeItem('username');
            }
        }

        this.updateAuthUI();
        this.updateCartUI();
        this.navigate('home');
    },

    async navigate(view, params = null) {
        const container = document.getElementById('app-container');
        container.innerHTML = components.loading();

        try {
            if (view === 'home') {
                if (this.state.products.length === 0) {
                    this.state.products = await api.getProducts();
                }
                this.renderHome(container);
            } else if (view === 'product') {
                const product = await api.getProduct(params);
                this.renderProduct(container, product);
            }
        } catch (error) {
            container.innerHTML = components.error(error.message);
        }
    },

    renderHome(container) {
        const html = `
            <h1 style="margin-bottom: 2rem; font-size: 2.5rem;">Discover Premium Tech</h1>
            <div class="product-grid">
                ${this.state.products.map(p => components.productCard(p)).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderProduct(container, product) {
        container.innerHTML = components.productDetails(product);
    },

    filterProducts(event) {
        const query = event.target.value.toLowerCase();
        const filtered = this.state.products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );
        
        const container = document.getElementById('app-container');
        const html = `
            <h1 style="margin-bottom: 2rem; font-size: 2.5rem;">Search Results</h1>
            <div class="product-grid">
                ${filtered.length > 0 
                    ? filtered.map(p => components.productCard(p)).join('') 
                    : '<p style="color: var(--text-secondary); grid-column: 1/-1;">No products found.</p>'}
            </div>
        `;
        container.innerHTML = html;
    },

    async filterByCategory(category) {
        // Update select value if called programmatically
        const categorySelect = document.getElementById('category-select');
        if (categorySelect && categorySelect.value !== category) {
            categorySelect.value = category;
        }

        const container = document.getElementById('app-container');
        container.innerHTML = components.loading();

        try {
            if (category === 'All Products') {
                this.state.products = await api.getProducts();
            } else {
                this.state.products = await api.request(`/products?category=${encodeURIComponent(category)}`);
            }
            this.renderHome(container);
            
            // Clear search input if any
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
        } catch (error) {
            container.innerHTML = components.error(error.message);
        }
    },

    // Cart Management
    addToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return; // Note: might need to fetch if not in state

        const existingItem = this.state.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast(`Added ${product.name} to cart`, 'success');
    },

    updateCartQty(productId, delta) {
        const item = this.state.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    },

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
    },

    updateCartUI() {
        const count = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').innerText = count;

        const cartItemsContainer = document.getElementById('cart-items');
        if (this.state.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">Your cart is empty.</p>';
        } else {
            cartItemsContainer.innerHTML = this.state.cart.map(item => components.cartItem(item)).join('');
        }

        const total = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cart-total-price').innerText = `$${total.toFixed(2)}`;
    },

    toggleCart() {
        document.getElementById('cart-overlay').classList.toggle('hidden');
    },

    // Authentication
    updateAuthUI() {
        const authActions = document.getElementById('auth-actions');
        if (this.state.user) {
            authActions.innerHTML = `
                <span style="color: var(--text-secondary); font-weight: 500;">Hello, ${this.state.user.username}</span>
                <button class="icon-btn" onclick="app.logout()" title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
            `;
        } else {
            authActions.innerHTML = `
                <button class="icon-btn" onclick="app.toggleAuthModal(); app.switchAuthTab('login')" title="Login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                </button>
                <button class="icon-btn" onclick="app.toggleAuthModal(); app.switchAuthTab('register')" title="Sign Up">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                </button>
            `;
        }
    },

    toggleWishlist() {
        this.showToast('Wishlist feature coming soon!', 'success');
    },

    toggleAuthModal() {
        document.getElementById('auth-modal').classList.toggle('hidden');
    },

    switchAuthTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form-view').forEach(view => view.classList.add('hidden'));
        
        event.target.classList.add('active');
        document.getElementById(`${tab}-view`).classList.remove('hidden');
    },

    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const data = await api.login(username, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            this.state.user = { username: data.username };
            this.updateAuthUI();
            this.toggleAuthModal();
            this.showToast('Logged in successfully', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    },

    async handleRegister(event) {
        event.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        try {
            await api.register(username, email, password);
            this.showToast('Registration successful! Please log in.', 'success');
            this.switchAuthTab('login');
            // Mock click on login tab
            document.querySelector('.tab-btn[onclick*="login"]').classList.add('active');
            document.querySelector('.tab-btn[onclick*="register"]').classList.remove('active');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.state.user = null;
        this.updateAuthUI();
        this.showToast('Logged out successfully', 'success');
    },

    // Checkout
    async checkout() {
        if (!this.state.user) {
            this.showToast('Please sign in to checkout', 'error');
            this.toggleCart();
            this.toggleAuthModal();
            return;
        }

        if (this.state.cart.length === 0) {
            this.showToast('Your cart is empty', 'error');
            return;
        }

        const items = this.state.cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
        }));
        const total = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        try {
            const data = await api.checkout(items, total);
            this.state.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.toggleCart();
            this.showToast(`Order placed! ID: ${data.orderId}`, 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    },

    // UI Helpers
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => app.init());
