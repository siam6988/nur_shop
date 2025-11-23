// Main Application JavaScript
class NURApp {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('nur_cart')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('nur_user')) || null;
        this.init();
    }

    init() {
        this.initializeSlider();
        this.loadProducts();
        this.updateCartCount();
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    // Banner Slider
    initializeSlider() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        let currentSlide = 0;
        const slideInterval = 3000; // 3 seconds

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            showSlide(next);
        }

        function prevSlide() {
            let prev = currentSlide - 1;
            if (prev < 0) prev = slides.length - 1;
            showSlide(prev);
        }

        // Auto slide
        let slideTimer = setInterval(nextSlide, slideInterval);

        // Pause on hover
        const slider = document.querySelector('.slider-container');
        slider.addEventListener('mouseenter', () => clearInterval(slideTimer));
        slider.addEventListener('mouseleave', () => {
            slideTimer = setInterval(nextSlide, slideInterval);
        });

        // Controls
        nextBtn.addEventListener('click', () => {
            clearInterval(slideTimer);
            nextSlide();
            slideTimer = setInterval(nextSlide, slideInterval);
        });

        prevBtn.addEventListener('click', () => {
            clearInterval(slideTimer);
            prevSlide();
            slideTimer = setInterval(nextSlide, slideInterval);
        });

        // Dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideTimer);
                showSlide(index);
                slideTimer = setInterval(nextSlide, slideInterval);
            });
        });
    }

    // Load Products
    async loadProducts() {
        try {
            // Simulate API call with sample data
            this.products = [
                {
                    id: 1,
                    name: "Wireless Bluetooth Headphones",
                    price: 2499,
                    originalPrice: 3499,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                    category: "Electronics",
                    rating: 4.2,
                    reviews: 128,
                    discount: 29,
                    freeShipping: true,
                    badge: "discount"
                },
                {
                    id: 2,
                    name: "Smart Fitness Watch",
                    price: 3499,
                    originalPrice: 4499,
                    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                    category: "Electronics",
                    rating: 4.5,
                    reviews: 89,
                    discount: 22,
                    freeShipping: true,
                    badge: "discount"
                },
                {
                    id: 3,
                    name: "Premium Leather Bag",
                    price: 1899,
                    originalPrice: 2399,
                    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                    category: "Fashion",
                    rating: 4.0,
                    reviews: 67,
                    discount: 21,
                    freeShipping: false,
                    badge: "discount"
                },
                {
                    id: 4,
                    name: "Wireless Earbuds",
                    price: 1299,
                    originalPrice: 1499,
                    image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                    category: "Electronics",
                    rating: 4.3,
                    reviews: 156,
                    discount: 13,
                    freeShipping: true,
                    badge: "discount"
                },
                {
                    id: 5,
                    name: "Sports Running Shoes",
                    price: 2999,
                    originalPrice: 3999,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                    category: "Sports",
                    rating: 4.7,
                    reviews: 203,
                    discount: 25,
                    freeShipping: true,
                    badge: "discount"
                },
                {
                    id: 6,
                    name: "Smartphone Case",
                    price: 499,
                    originalPrice: 799,
                    image: "https://images.unsplash.com/photo-1601593346740-925612772716?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                    category: "Electronics",
                    rating: 4.1,
                    reviews: 45,
                    discount: 38,
                    freeShipping: false,
                    badge: "discount"
                }
            ];

            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showToast('Error loading products', 'error');
        }
    }

    // Render Products
    renderProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;

        container.innerHTML = this.products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-badges">
                        ${product.discount ? `<div class="badge badge-discount">${product.discount}% OFF</div>` : ''}
                        ${product.freeShipping ? `<div class="badge badge-shipping">FREE Shipping</div>` : ''}
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
                            Add to Cart
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

    // Generate Star Rating
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
    }

    // Cart Management
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                cartId: Date.now()
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showToast('Product added to cart successfully!');
    }

    removeFromCart(cartId) {
        this.cart = this.cart.filter(item => item.cartId !== cartId);
        this.saveCart();
        this.updateCartCount();
        this.showToast('Product removed from cart');
    }

    updateCartQuantity(cartId, quantity) {
        const item = this.cart.find(item => item.cartId === cartId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartCount();
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('nur_cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    // Wishlist Management
    addToWishlist(productId) {
        if (!this.currentUser) {
            this.showToast('Please login to add items to wishlist', 'warning');
            window.location.href = 'auth.html';
            return;
        }

        const wishlist = JSON.parse(localStorage.getItem('nur_wishlist')) || [];
        const product = this.products.find(p => p.id === productId);
        
        if (!wishlist.find(item => item.id === productId)) {
            wishlist.push(product);
            localStorage.setItem('nur_wishlist', JSON.stringify(wishlist));
            this.showToast('Product added to wishlist!');
        } else {
            this.showToast('Product already in wishlist');
        }
    }

    // Authentication
    checkAuthStatus() {
        if (this.currentUser) {
            const accountLinks = document.querySelectorAll('a[href="auth.html"]');
            accountLinks.forEach(link => {
                link.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    ${this.currentUser.name}
                `;
                link.href = 'profile.html';
            });
        }
    }

    // Toast Notifications
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (!toast || !toastMessage) return;

        // Set color based on type
        if (type === 'error') {
            toast.style.background = 'var(--danger)';
        } else if (type === 'warning') {
            toast.style.background = 'var(--warning)';
        } else {
            toast.style.background = 'var(--success)';
        }

        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Search Functionality
    setupEventListeners() {
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });

            const searchBtn = document.querySelector('.search-bar button');
            if (searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.performSearch(searchInput.value);
                });
            }
        }

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.querySelector('.category-name').textContent;
                window.location.href = `shop.html?category=${encodeURIComponent(category)}`;
            });
        });
    }

    performSearch(query) {
        if (query.trim()) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
    }

    // Utility Methods
    formatPrice(price) {
        return '৳ ' + price.toLocaleString();
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
}

// Initialize the app
const nurApp = new NURApp();

// Global functions for HTML onclick events
function addToCart(productId) {
    nurApp.addToCart(productId);
}

function addToWishlist(productId) {
    nurApp.addToWishlist(productId);
}
