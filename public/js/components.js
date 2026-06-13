const components = {
    productCard(product) {
        return `
            <div class="product-card glass" onclick="app.navigate('product', ${product.id})">
                <div class="product-img-container">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-img" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="btn btn-outline btn-block" onclick="event.stopPropagation(); app.addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    },

    productDetails(product) {
        return `
            <div class="product-details-view">
                <div class="details-img-container">
                    <img src="${product.imageUrl}" alt="${product.name}" class="details-img">
                </div>
                <div class="details-info">
                    <h1>${product.name}</h1>
                    <div class="details-price">$${product.price.toFixed(2)}</div>
                    <p class="details-description">${product.description}</p>
                    <button class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;" onclick="app.addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    },

    cartItem(item) {
        return `
            <div class="cart-item">
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="app.updateCartQty(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="app.updateCartQty(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="app.removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    },

    loading() {
        return `<div style="text-align: center; padding: 4rem; color: var(--text-secondary);">Loading...</div>`;
    },

    error(message) {
        return `<div style="text-align: center; padding: 4rem; color: var(--danger);">${message}</div>`;
    }
};
