// Product Management
class NURProduct {
    constructor() {
        this.currentProduct = null;
        this.selectedSize = null;
        this.selectedColor = null;
        this.quantity = 1;
        this.init();
    }

    init() {
        this.loadProductDetails();
        this.setupProductInteractions();
        this.setupImageGallery();
        this.setupTabs();
    }

    loadProductDetails() {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1;

        // In real app, this would be an API call
        const products = [
            {
                id: 1,
                name: "Premium Wireless Headphones with Noise Cancellation",
                price: 2499,
                originalPrice: 3499,
                images: [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1521334884684-d80222895322?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                ],
                category: "Electronics",
                rating: 4.2,
                reviews: 128,
                discount: 29,
                freeShipping: true,
                sizes: ["Black", "White", "Blue", "Red"],
                description: "Experience premium sound quality with our latest wireless headphones...",
                specifications: {
                    "Brand": "NUR Audio",
                    "Model": "HP-2023",
                    "Connectivity": "Bluetooth 5.0",
                    "Battery Life": "Up to 30 hours",
                    "Noise Cancellation": "Active Noise Cancellation (ANC)",
                    "Warranty": "1 year"
                },
                reviews: [
                    {
                        name: "Rahim Khan",
                        date: "March 15, 2023",
                        rating: 5,
                        comment: "Excellent sound quality and very comfortable to wear for long periods."
                    },
                    {
                        name: "Sadia Ahmed",
                        date: "February 28, 2023",
                        rating: 4,
                        comment: "Great headphones for the price. Sound is clear and bass is good."
                    }
                ]
            }
        ];

        this.currentProduct = products.find(p => p.id === productId) || products[0];
        this.renderProductDetails();
        this.loadRelatedProducts();
    }

    renderProductDetails() {
        if (!this.currentProduct) return;

        // Update page title
        document.title = `${this.currentProduct.name} - NUR Premium Shopping`;

        // Update product details
        const productTitle = document.querySelector('.product-title');
        const productPrice = document.querySelector('.current-price');
        const originalPrice = document.querySelector('.original-price');
        const discount = document.querySelector('.discount');
        const productRating = document.querySelector('.product-rating .stars');
        const ratingCount = document.querySelector('.rating-count');

        if (productTitle) productTitle.textContent = this.currentProduct.name;
        if (productPrice) productPrice.textContent = `৳ ${this.currentProduct.price.toLocaleString()}`;
        if (originalPrice) originalPrice.textContent = `৳ ${this.currentProduct.originalPrice.toLocaleString()}`;
        if (discount) discount.textContent = `${this.currentProduct.discount}% OFF`;
        if (productRating) productRating.textContent = this.generateStars(this.currentProduct.rating);
        if (ratingCount) ratingCount.textContent = `(${this.currentProduct.reviews} reviews)`;

        // Render sizes/colors
        this.renderSizeOptions();
        
        // Render images
        this.renderProductImages();

        // Render description and specs
        this.renderProductTabs();
    }

    renderSizeOptions() {
        const sizeContainer = document.querySelector('.size-options');
        if (!sizeContainer || !this.currentProduct.sizes) return;

        sizeContainer.innerHTML = this.currentProduct.sizes.map((size, index) => `
            <div class="size-option ${index === 0 ? 'selected' : ''}" data-value="${size}">
                ${size}
            </div>
        `).join('');

        this.selectedSize = this.currentProduct.sizes[0];
    }

    renderProductImages() {
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.querySelector('.image-thumbnails');

        if (mainImage && this.currentProduct.images.length > 0) {
            mainImage.src = this.currentProduct.images[0];
        }

        if (thumbnails) {
            thumbnails.innerHTML = this.currentProduct.images.map((image, index) => `
                <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${image}">
                    <img src="${image}" alt="Product thumbnail ${index + 1}">
                </div>
            `).join('');
        }
    }

    renderProductTabs() {
        // Description
        const descriptionContent = document.querySelector('.description-content');
        if (descriptionContent) {
            descriptionContent.innerHTML = `
                <p>${this.currentProduct.description}</p>
                <h3>Key Features:</h3>
                <ul>
                    <li>Active Noise Cancellation technology</li>
                    <li>30 hours of battery life</li>
                    <li>Fast charging: 15 minutes = 5 hours playback</li>
                    <li>Premium comfort-fit design</li>
                    <li>High-quality audio drivers</li>
                </ul>
            `;
        }

        // Specifications
        const specsTable = document.querySelector('.specs-table');
        if (specsTable && this.currentProduct.specifications) {
            specsTable.innerHTML = Object.entries(this.currentProduct.specifications)
                .map(([key, value]) => `
                    <tr>
                        <td>${key}</td>
                        <td>${value}</td>
                    </tr>
                `).join('');
        }

        // Reviews
        this.renderReviews();
    }

    renderReviews() {
        const reviewsList = document.querySelector('.reviews-list');
        if (!reviewsList || !this.currentProduct.reviews) return;

        reviewsList.innerHTML = this.currentProduct.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-name">${review.name}</div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-rating">${this.generateStars(review.rating)}</div>
                <div class="review-text">${review.comment}</div>
            </div>
        `).join('');
    }

    setupProductInteractions() {
        // Size selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.size-option')) {
                const sizeOption = e.target.closest('.size-option');
                document.querySelectorAll('.size-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                sizeOption.classList.add('selected');
                this.selectedSize = sizeOption.dataset.value;
            }
        });

        // Quantity controls
        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const quantityInput = document.getElementById('quantity-input');

        if (decreaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                    this.quantity = value - 1;
                }
            });
        }

        if (increaseBtn && quantityInput) {
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value < 10) {
                    quantityInput.value = value + 1;
                    this.quantity = value + 1;
                }
            });
        }

        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                let value = parseInt(e.target.value);
                if (value < 1) value = 1;
                if (value > 10) value = 10;
                e.target.value = value;
                this.quantity = value;
            });
        }

        // Add to cart
        const addToCartBtn = document.getElementById('add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }

        // Buy now
        const buyNowBtn = document.getElementById('buy-now');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.buyNow();
            });
        }

        // Add to wishlist
        const wishlistBtn = document.getElementById('add-to-wishlist');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.addToWishlist();
            });
        }
    }

    setupImageGallery() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.thumbnail')) {
                const thumbnail = e.target.closest('.thumbnail');
                const imageUrl = thumbnail.dataset.image;
                
                // Update main image
                const mainImage = document.getElementById('main-product-image');
                if (mainImage) {
                    mainImage.src = imageUrl;
                }

                // Update active thumbnail
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                thumbnail.classList.add('active');
            }
        });
    }

    setupTabs() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-header')) {
                const tabHeader = e.target.closest('.tab-header');
                const tabId = tabHeader.dataset.tab;
                
                // Remove active class from all tabs
                document.querySelectorAll('.tab-header').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Add active class to clicked tab
                tabHeader.classList.add('active');
                
                // Hide all tab panes
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Show selected tab pane
                const tabPane = document.getElementById(tabId);
                if (tabPane) {
                    tabPane.classList.add('active');
                }
            }
        });
    }

    addToCart() {
        if (!this.currentProduct) return;

        const cartItem = {
            ...this.currentProduct,
            quantity: this.quantity,
            selectedSize: this.selectedSize,
            selectedColor: this.selectedColor,
            cartId: Date.now()
        };

        // Use the main app's cart functionality
        if (window.nurApp) {
            window.nurApp.addToCart(this.currentProduct.id);
        } else {
            // Fallback cart implementation
            const cart = JSON.parse(localStorage.getItem('nur_cart')) || [];
            const existingItem = cart.find(item => 
                item.id === this.currentProduct.id && 
                item.selectedSize === this.selectedSize
            );

            if (existingItem) {
                existingItem.quantity += this.quantity;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem('nur_cart', JSON.stringify(cart));
            this.showToast('Product added to cart successfully!');
        }
    }

    buyNow() {
        this.addToCart();
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 500);
    }

    addToWishlist() {
        if (!this.currentProduct) return;

        if (window.nurApp) {
            window.nurApp.addToWishlist(this.currentProduct.id);
        } else {
            // Fallback wishlist implementation
            const wishlist = JSON.parse(localStorage.getItem('nur_wishlist')) || [];
            
            if (!wishlist.find(item => item.id === this.currentProduct.id)) {
                wishlist.push(this.currentProduct);
                localStorage.setItem('nur_wishlist', JSON.stringify(wishlist));
                this.showToast('Product added to wishlist!');
            } else {
                this.showToast('Product already in wishlist');
            }
        }
    }

    loadRelatedProducts() {
        // This would typically load products from the same category
        const relatedContainer = document.querySelector('.related-products .products-grid');
        if (!relatedContainer) return;

        // Simulate related products
        const relatedProducts = [
            {
                id: 2,
                name: "True Wireless Earbuds with Charging Case",
                price: 1299,
                originalPrice: 1499,
                image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                category: "Electronics",
                rating: 4.3,
                reviews: 87,
                discount: 15,
                freeShipping: true
            },
            {
                id: 3,
                name: "Smart Watch with Health Monitoring",
                price: 3499,
                originalPrice: 4499,
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                category: "Electronics",
                rating: 4.5,
                reviews: 142,
                discount: 25,
                freeShipping: true
            }
        ];

        relatedContainer.innerHTML = relatedProducts.map(product => `
            <div class="product-card">
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
                        <span class="original-price-card">৳ ${product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div class="product-rating-card">
                        <div class="stars-card">${this.generateStars(product.rating)}</div>
                        <div class="rating-count-card">(${product.reviews})</div>
                    </div>
                    <div class="product-actions-card">
                        <button class="btn-card btn-card-primary" onclick="window.location.href='product.html?id=${product.id}'">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
    }

    showToast(message, type = 'success') {
        if (window.nurApp) {
            window.nurApp.showToast(message, type);
        } else {
            // Fallback toast implementation
            console.log(`${type}: ${message}`);
        }
    }
}

// Initialize product page
if (window.location.pathname.includes('product.html')) {
    const nurProduct = new NURProduct();
}
