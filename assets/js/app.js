// Main Application JavaScript (Updated for Language Support)
class NURApp {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('nur_cart')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('nur_user')) || null;
        this.language = window.nurLanguage;
        this.init();
    }

    // ... (previous methods remain same, just update text generation)

    renderProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;

        container.innerHTML = this.products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-badges">
                        ${product.discount ? `<div class="badge badge-discount">${product.discount}% OFF</div>` : ''}
                        ${product.freeShipping ? `<div class="badge badge-shipping">${this.language.getText('free_shipping')}</div>` : ''}
                    </div>
                </div>
                <div class="product-info-card">
                    <div class="product-category">${product.category}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-price-card">
                        <span class="current-price-card">৳ ${product.price.toLocaleString()}</span>
                        ${product.originalPrice ? `<span class="original-price-card">৳ ${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="product-rating-card">
                        <div class="stars-card">${this.generateStars(product.rating)}</div>
                        <div class="rating-count-card">(${product.reviews})</div>
                    </div>
                    <div class="product-actions-card">
                        <button class="btn-card btn-card-primary" onclick="nurApp.addToCart(${product.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            ${this.language.getText('add_to_cart')}
                        </button>
                        <button class="btn-card btn-card-outline" onclick="nurApp.addToWishlist(${product.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ... rest of the methods remain same
}

// Initialize the app
const nurApp = new NURApp();
