// NUR Shopping Application JavaScript

class NURShoppingApp {
    constructor() {
        this.currentUser = null;
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.products = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.updateCartCount();
        this.setupSlider();
        this.setupTimer();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchButton = document.querySelector('.search-button');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', () => this.performSearch());
        }

        // Add to cart buttons (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                const productId = e.target.closest('.add-to-cart-btn').dataset.productId;
                this.addToCart(productId);
            }
        });

        // Category filter
        const categorySelect = document.querySelector('.category-select');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.filterProductsByCategory(e.target.value);
            });
        }
    }

    performSearch() {
        const searchInput = document.querySelector('.search-input');
        const query = searchInput.value.trim();
        
        if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
    }

    async loadProducts() {
        try {
            // Sample products data (In real app, fetch from Firestore)
            this.products = this.getSampleProducts();
            this.displayFeaturedProducts();
            this.displayFlashSaleProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    getSampleProducts() {
        return [
            {
                id: '1',
                name: 'Premium Cotton T-Shirt',
                description: '100% Cotton, Premium Quality',
                price: 899,
                originalPrice: 1299,
                discount: 30,
                category: 'men',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
                rating: 4.5,
                reviews: 128,
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 50,
                isFlashSale: true,
                freeShipping: true
            },
            {
                id: '2',
                name: 'Wireless Bluetooth Headphones',
                description: 'Noise Cancelling, 30hrs Battery',
                price: 2499,
                originalPrice: 3499,
                discount: 28,
                category: 'electronics',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
                rating: 4.7,
                reviews: 89,
                stock: 25,
                isFlashSale: true,
                freeShipping: false
            },
            {
                id: '3',
                name: 'Designer Handbag',
                description: 'Genuine Leather, Premium Finish',
                price: 4599,
                originalPrice: 5999,
                discount: 23,
                category: 'women',
                image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
                rating: 4.3,
                reviews: 45,
                stock: 15,
                isFlashSale: false,
                freeShipping: true
            },
            {
                id: '4',
                name: 'Smart Watch Series 5',
                description: 'Heart Rate Monitor, Water Resistant',
                price: 3899,
                originalPrice: 4999,
                discount: 22,
                category: 'electronics',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
                rating: 4.6,
                reviews: 156,
                stock: 30,
                isFlashSale: true,
                freeShipping: true
            },
            {
                id: '5',
                name: 'Running Shoes',
                description: 'Lightweight, Breathable Material',
                price: 2799,
                originalPrice: 3599,
                discount: 22,
                category: 'sports',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
                rating: 4.4,
                reviews: 78,
                sizes: ['8', '9', '10', '11'],
                stock: 40,
                isFlashSale: false,
                freeShipping: true
            },
            {
                id: '6',
                name: 'Premium Bed Sheet Set',
                description: '300 Thread Count, King Size',
                price: 3299,
                originalPrice: 4299,
                discount: 23,
                category: 'home',
                image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6',
                rating: 4.2,
                reviews: 34,
                stock: 20,
                isFlashSale: true,
                freeShipping: false
            },
            {
                id: '7',
                name: 'Beauty Cream Set',
                description: 'Organic Ingredients, 5 Products',
                price: 1599,
                originalPrice: 2299,
                discount: 30,
                category: 'beauty',
                image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
                rating: 4.1,
                reviews: 56,
                stock: 60,
                isFlashSale: false,
                freeShipping: true
            },
            {
                id: '8',
                name: 'Denim Jacket',
                description: 'Classic Fit, Premium Denim',
                price: 1999,
                originalPrice: 2799,
                discount: 28,
                category: 'men',
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
                rating: 4.5,
                reviews: 92,
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 35,
                isFlashSale: true,
                freeShipping: true
            }
        ];
    }

    displayFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;

        const featuredProducts = this.products.slice(0, 8);
        container.innerHTML = featuredProducts.map(product => this.createProductCard(product)).join('');
    }

    displayFlashSaleProducts() {
        const container = document.getElementById('flash-sale-products');
        if (!container) return;

        const flashProducts = this.products.filter(p => p.isFlashSale);
        container.innerHTML = flashProducts.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const ratingStars = this.generateStarRating(product.rating);
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                ${product.discount ? `<span class="product-badge badge-discount">${discount}% OFF</span>` : ''}
                ${product.freeShipping ? `<span class="product-badge" style="background-color: var(--success); top: 40px;">Free Shipping</span>` : ''}
                
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-actions">
                        <button class="action-btn" title="Add to Wishlist">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        <button class="action-btn" title="Quick View">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">৳${product.price.toLocaleString()}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">৳${product.originalPrice.toLocaleString()}</span>
                             <span class="discount-percent">${discount}% OFF</span>` : ''}
                    </div>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${ratingStars}
                        </div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    
                    ${product.sizes ? `
                        <div class="product-sizes">
                            ${product.sizes.map(size => `<span class="size">${size}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += `
                <svg class="star" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            `;
        }
        
        if (halfStar) {
            stars += `
                <svg class="star" viewBox="0 0 24 24">
                    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
                </svg>
            `;
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += `
                <svg class="star" viewBox="0 0 24 24">
                    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
                </svg>
            `;
        }
        
        return stars;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cartItems.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                size: product.sizes ? product.sizes[0] : null
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showToast('Product added to cart');
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    updateCartCount() {
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCountElements = document.querySelectorAll('#cart-count, #floating-cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    setupSlider() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        if (!slides.length) return;

        let currentSlide = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        // Auto slide every 5 seconds
        setInterval(nextSlide, 5000);

        // Manual controls
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Dot controls
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Show first slide
        showSlide(currentSlide);
    }

    setupTimer() {
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (!hoursElement || !minutesElement || !secondsElement) return;

        let hours = 2;
        let minutes = 45;
        let seconds = 30;

        const updateTimer = () => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    if (hours < 0) {
                        hours = 0;
                        minutes = 0;
                        seconds = 0;
                        return;
                    }
                }
            }

            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        };

        setInterval(updateTimer, 1000);
    }

    filterProductsByCategory(category) {
        if (category === 'all') {
            this.displayFeaturedProducts();
        } else {
            const filteredProducts = this.products.filter(p => p.category === category);
            const container = document.getElementById('featured-products');
            if (container) {
                container.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
            }
        }
    }

    checkAuthState() {
        if (typeof auth !== 'undefined') {
            auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                this.updateAuthUI();
            });
        }
    }

    updateAuthUI() {
        const authLink = document.getElementById('auth-link');
        const userAction = document.getElementById('user-action');
        
        if (this.currentUser) {
            if (authLink) {
                authLink.innerHTML = `
                    <svg class="svg-icon" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    ${this.currentUser.displayName || 'My Account'}
                `;
                authLink.href = 'profile.html';
            }
            
            if (userAction) {
                userAction.querySelector('.action-text').textContent = this.currentUser.displayName || 'Account';
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NURShoppingApp();
});
