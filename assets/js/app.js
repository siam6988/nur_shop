// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "D20 Smart Watch Sport Fitness Tracker",
        price: 121.43,
        originalPrice: 766.07,
        discount: 72,
        image: "assets/img/products/smartwatch.jpg",
        rating: 4.2,
        reviews: 150,
        sold: 600,
        freeShipping: true,
        category: "electronics"
    },
    {
        id: 2,
        name: "HD Monocular Telescope",
        price: 121.43,
        originalPrice: 441.57,
        discount: 72,
        image: "assets/img/products/telescope.jpg",
        rating: 4.0,
        reviews: 286,
        sold: 1000,
        freeShipping: true,
        category: "electronics"
    },
    {
        id: 3,
        name: "Night Vision Glasses",
        price: 112.85,
        originalPrice: 172.95,
        discount: 35,
        image: "assets/img/products/glasses.jpg",
        rating: 4.5,
        reviews: 299,
        sold: 500,
        freeShipping: false,
        category: "electronics"
    },
    {
        id: 4,
        name: "Fashion Stainless Steel Ring",
        price: 361.49,
        originalPrice: 2239.62,
        discount: 83,
        image: "assets/img/products/ring.jpg",
        rating: 4.2,
        reviews: 150,
        sold: 200,
        freeShipping: true,
        category: "fashion"
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('nurCart')) || [];

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

// Add to Cart
function addToCart(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('nurCart', JSON.stringify(cart));
    updateCartCount();
    showToast('পণ্য কার্টে যোগ করা হয়েছে');
}

// Show Toast Message
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Load Featured Products
function loadFeaturedProducts() {
    const productsGrid = document.getElementById('featuredProducts');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    sampleProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image" onclick="viewProduct(${product.id})">
                <div style="width:100%;height:200px;background:#f8fafc;display:flex;align-items:center;justify-content:center;color:#64748b;">
                    <i class="fas fa-image fa-2x"></i>
                </div>
                ${product.discount ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
                ${product.freeShipping ? '<div class="free-shipping-badge">ফ্রি শিপিং</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">৳${product.price.toLocaleString()}</span>
                    <span class="original-price">৳${product.originalPrice.toLocaleString()}</span>
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="addToCart(${product.id})">কার্টে যোগ করুন</button>
                    <button class="btn-wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// View Product Details
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Banner Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    document.querySelectorAll('.dot')[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
}

// Search Functionality
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
}

// Modal Functions
function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadFeaturedProducts();
    showSlide(0);
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Dot click events
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Search on enter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Modal close
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
