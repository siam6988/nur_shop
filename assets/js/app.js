// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSYALT_jaIQrTq-oZP9sMyUJWXaLSjTY4",
  authDomain: "nur-shop-siam.firebaseapp.com",
  projectId: "nur-shop-siam",
  storageBucket: "nur-shop-siam.firebasestorage.app",
  messagingSenderId: "536596371721",
  appId: "1:536596371721:web:454f879521237e61211bd8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Language Management
let currentLanguage = localStorage.getItem('nurLanguage') || 'bn';

// DOM Elements
const cartCountElements = document.querySelectorAll('.cart-count');
const floatingCart = document.querySelector('.floating-cart');
const productsGrid = document.querySelector('.products-grid');
const sliderContainer = document.querySelector('.slider-container');
const dots = document.querySelectorAll('.dot');
const languageSelect = document.getElementById('languageSelect');

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "মেনস কটন শার্ট | Men's Cotton Shirt",
        price: 899,
        originalPrice: 1299,
        discount: 30,
        image: "assets/img/products/shirt.jpg",
        rating: 4.5,
        reviews: 124,
        freeShipping: true
    },
    {
        id: 2,
        name: "স্মার্টফোন এক্স১০ | Smartphone X10",
        price: 18999,
        originalPrice: 21999,
        discount: 15,
        image: "assets/img/products/phone.jpg",
        rating: 4.2,
        reviews: 89,
        freeShipping: true
    },
    {
        id: 3,
        name: "ব্লুটুথ হেডফোন | Bluetooth Headphone",
        price: 1599,
        originalPrice: 2499,
        discount: 35,
        image: "assets/img/products/headphone.jpg",
        rating: 4.7,
        reviews: 203,
        freeShipping: false
    },
    {
        id: 4,
        name: "স্পোর্টস শু | Sports Shoes",
        price: 2499,
        originalPrice: 3499,
        discount: 28,
        image: "assets/img/products/shoes.jpg",
        rating: 4.3,
        reviews: 67,
        freeShipping: true
    }
];

// Language Functions
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('nurLanguage', lang);
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-bn], [data-en]');
    elements.forEach(element => {
        if (element.hasAttribute(`data-${lang}`)) {
            const text = element.getAttribute(`data-${lang}`);
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update select element
    if (languageSelect) {
        languageSelect.value = lang;
    }
    
    // Reload product names based on language
    loadFeaturedProducts();
}

function getProductName(product, lang) {
    if (product.name.includes('|')) {
        const parts = product.name.split('|');
        return lang === 'bn' ? parts[0].trim() : parts[1].trim();
    }
    return product.name;
}

// Cart Management
let cart = JSON.parse(localStorage.getItem('nurCart')) || [];

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

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
    showToast(currentLanguage === 'bn' ? 'পণ্য কার্টে যোগ করা হয়েছে' : 'Product added to cart');
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
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
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Banner Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

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

// Auto slide every 5 seconds
setInterval(nextSlide, 5000);

// Dot click events
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Load Featured Products
function loadFeaturedProducts() {
    productsGrid.innerHTML = '';
    
    sampleProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${getProductName(product, currentLanguage)}">
                ${product.discount ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
                ${product.freeShipping ? `<div class="free-shipping-badge">${currentLanguage === 'bn' ? 'ফ্রি শিপিং' : 'Free Shipping'}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${getProductName(product, currentLanguage)}</h3>
                <div class="product-price">
                    <span class="current-price">৳${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="original-price">৳${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-actions">
                    <button class="btn-cart" onclick="addToCart(${product.id})">
                        ${currentLanguage === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                    </button>
                    <button class="btn-wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language
    setLanguage(currentLanguage);
    updateCartCount();
    loadFeaturedProducts();
    showSlide(0);
    
    // Language switcher event
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
    
    // Floating cart click event
    if (floatingCart) {
        floatingCart.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
            }
        };
        
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Firebase Authentication Functions
function signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
}

function signIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
}

function signInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return auth.signInWithPopup(provider);
}

function signOut() {
    return auth.signOut();
}

// Firestore Functions
function addProduct(productData) {
    return db.collection('products').add(productData);
}

function getProducts() {
    return db.collection('products').get();
}

function updateProduct(productId, productData) {
    return db.collection('products').doc(productId).update(productData);
}

function deleteProduct(productId) {
    return db.collection('products').doc(productId).delete();
}

function addOrder(orderData) {
    return db.collection('orders').add({
        ...orderData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending'
    });
}

function getOrders() {
    return db.collection('orders').orderBy('createdAt', 'desc').get();
}

function updateOrderStatus(orderId, status) {
    return db.collection('orders').doc(orderId).update({ status });
}

// Loyalty Points System
function calculatePoints(orderTotal) {
    return Math.floor(orderTotal / 100);
}

function addUserPoints(userId, points) {
    return db.collection('users').doc(userId).update({
        points: firebase.firestore.FieldValue.increment(points)
    });
}

// Admin Functions
function uploadBanner(imageFile) {
    const storageRef = firebase.storage().ref();
    const bannerRef = storageRef.child(`banners/${Date.now()}_${imageFile.name}`);
    
    return bannerRef.put(imageFile).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    });
}

function getBanners() {
    return db.collection('banners').orderBy('order').get();
}
