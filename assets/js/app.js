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

// DOM Elements
const cartCountElements = document.querySelectorAll('.cart-count');
const floatingCart = document.querySelector('.floating-cart');
const productsGrid = document.querySelector('.products-grid');
const sliderContainer = document.querySelector('.slider-container');
const dots = document.querySelectorAll('.dot');
const languageSelect = document.getElementById('languageSelect');

// Language Translations
const translations = {
    bn: {
        // Header
        searchPlaceholder: "পণ্য খুঁজুন...",
        account: "অ্যাকাউন্ট",
        wishlist: "উইশলিস্ট",
        cart: "কার্ট",
        
        // Navigation
        home: "হোম",
        shop: "শপ",
        categories: "ক্যাটাগরি",
        deals: "ডিলস",
        about: "আমাদের সম্পর্কে",
        contact: "যোগাযোগ",
        
        // Banner
        banner1Title: "নুর - যেখানে শপিং = মজা",
        banner1Desc: "সেরা ব্র্যান্ডের পণ্য একই জায়গায়",
        banner1Btn: "এখনই কিনুন",
        
        banner2Title: "বড় ডিসকাউন্টে পণ্য কিনুন",
        banner2Desc: "৫০% পর্যন্ত ছাড়",
        banner2Btn: "ডিলস দেখুন",
        
        banner3Title: "ফ্রি শিপিং",
        banner3Desc: "১০০০ টাকার উপর অর্ডারে ফ্রি ডেলিভারি",
        banner3Btn: "শপিং করুন",
        
        // Sections
        browseCategories: "ক্যাটাগরি ব্রাউজ করুন",
        featuredProducts: "ফিচার্ড পণ্য",
        viewAllProducts: "সব পণ্য দেখুন",
        specialOffers: "বিশেষ অফার",
        
        // Categories
        fashion: "ফ্যাশন",
        electronics: "ইলেকট্রনিক্স",
        homeAppliances: "হোম অ্যাপ্লায়েন্স",
        kitchen: "রান্নাঘর",
        health: "স্বাস্থ্য",
        sports: "খেলাধুলা",
        
        // Offers
        offer1Title: "Point জমাও, Discount নাও, Hero হও",
        offer1Desc: "প্রতি ১০০ টাকা শপিংয়ে ১ পয়েন্ট পান",
        offer1Btn: "বিস্তারিত জানুন",
        
        offer2Title: "ফ্রি ডেলিভারি",
        offer2Desc: "১০০০ টাকার উপর অর্ডারে ফ্রি শিপিং",
        offer2Btn: "শপিং করুন",
        
        // Product Actions
        addToCart: "কার্টে যোগ করুন",
        
        // Toast Messages
        addedToCart: "পণ্য কার্টে যোগ করা হয়েছে"
    },
    en: {
        // Header
        searchPlaceholder: "Search products...",
        account: "Account",
        wishlist: "Wishlist",
        cart: "Cart",
        
        // Navigation
        home: "Home",
        shop: "Shop",
        categories: "Categories",
        deals: "Deals",
        about: "About Us",
        contact: "Contact",
        
        // Banner
        banner1Title: "NUR - Where Shopping = Fun",
        banner1Desc: "Best brand products in one place",
        banner1Btn: "Buy Now",
        
        banner2Title: "Buy Products at Big Discount",
        banner2Desc: "Up to 50% off",
        banner2Btn: "View Deals",
        
        banner3Title: "Free Shipping",
        banner3Desc: "Free delivery on orders above 1000৳",
        banner3Btn: "Start Shopping",
        
        // Sections
        browseCategories: "Browse Categories",
        featuredProducts: "Featured Products",
        viewAllProducts: "View All Products",
        specialOffers: "Special Offers",
        
        // Categories
        fashion: "Fashion",
        electronics: "Electronics",
        homeAppliances: "Home Appliances",
        kitchen: "Kitchen",
        health: "Health",
        sports: "Sports",
        
        // Offers
        offer1Title: "Earn Points, Get Discounts, Be Hero",
        offer1Desc: "Get 1 point for every 100৳ shopping",
        offer1Btn: "Learn More",
        
        offer2Title: "Free Delivery",
        offer2Desc: "Free shipping on orders above 1000৳",
        offer2Btn: "Shop Now",
        
        // Product Actions
        addToCart: "Add to Cart",
        
        // Toast Messages
        addedToCart: "Product added to cart"
    }
};

// Current Language
let currentLanguage = 'bn';

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "মেনস কটন শার্ট",
        name_en: "Men's Cotton Shirt",
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
        name: "স্মার্টফোন এক্স১০",
        name_en: "Smartphone X10",
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
        name: "ব্লুটুথ হেডফোন",
        name_en: "Bluetooth Headphone",
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
        name: "স্পোর্টস শু",
        name_en: "Sports Shoes",
        price: 2499,
        originalPrice: 3499,
        discount: 28,
        image: "assets/img/products/shoes.jpg",
        rating: 4.3,
        reviews: 67,
        freeShipping: true
    }
];

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
    showToast(translations[currentLanguage].addedToCart);
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Language Switch Functionality
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('nurLanguage', lang);
    
    // Update all text content
    updatePageContent();
}

function updatePageContent() {
    const t = translations[currentLanguage];
    
    // Update header
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    
    const accountText = document.querySelector('.action-item:nth-child(2) span');
    if (accountText) accountText.textContent = t.account;
    
    const wishlistText = document.querySelector('.action-item:nth-child(3) span');
    if (wishlistText) wishlistText.textContent = t.wishlist;
    
    const cartText = document.querySelector('.cart-icon span');
    if (cartText) cartText.textContent = t.cart;
    
    // Update navigation
    const navLinks = document.querySelectorAll('.navbar a');
    if (navLinks.length >= 6) {
        navLinks[0].textContent = t.home;
        navLinks[1].textContent = t.shop;
        navLinks[2].textContent = t.categories;
        navLinks[3].textContent = t.deals;
        navLinks[4].textContent = t.about;
        navLinks[5].textContent = t.contact;
    }
    
    // Update banner slides
    const slides = document.querySelectorAll('.slide-content');
    if (slides.length >= 3) {
        slides[0].querySelector('h2').textContent = t.banner1Title;
        slides[0].querySelector('p').textContent = t.banner1Desc;
        slides[0].querySelector('a').textContent = t.banner1Btn;
        
        slides[1].querySelector('h2').textContent = t.banner2Title;
        slides[1].querySelector('p').textContent = t.banner2Desc;
        slides[1].querySelector('a').textContent = t.banner2Btn;
        
        slides[2].querySelector('h2').textContent = t.banner3Title;
        slides[2].querySelector('p').textContent = t.banner3Desc;
        slides[2].querySelector('a').textContent = t.banner3Btn;
    }
    
    // Update section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length >= 4) {
        sectionTitles[0].textContent = t.browseCategories;
        sectionTitles[1].textContent = t.featuredProducts;
        sectionTitles[2].textContent = t.specialOffers;
    }
    
    // Update categories
    const categoryTitles = document.querySelectorAll('.category-card h3');
    if (categoryTitles.length >= 6) {
        categoryTitles[0].textContent = t.fashion;
        categoryTitles[1].textContent = t.electronics;
        categoryTitles[2].textContent = t.homeAppliances;
        categoryTitles[3].textContent = t.kitchen;
        categoryTitles[4].textContent = t.health;
        categoryTitles[5].textContent = t.sports;
    }
    
    // Update offers
    const offerContents = document.querySelectorAll('.offer-content');
    if (offerContents.length >= 2) {
        offerContents[0].querySelector('h3').textContent = t.offer1Title;
        offerContents[0].querySelector('p').textContent = t.offer1Desc;
        offerContents[0].querySelector('a').textContent = t.offer1Btn;
        
        offerContents[1].querySelector('h3').textContent = t.offer2Title;
        offerContents[1].querySelector('p').textContent = t.offer2Desc;
        offerContents[1].querySelector('a').textContent = t.offer2Btn;
    }
    
    // Update view all button
    const viewAllBtn = document.querySelector('.btn-secondary');
    if (viewAllBtn) viewAllBtn.textContent = t.viewAllProducts;
    
    // Reload products to update add to cart button text
    loadFeaturedProducts();
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

// Load Featured Products
function loadFeaturedProducts() {
    productsGrid.innerHTML = '';
    
    sampleProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${currentLanguage === 'bn' ? product.name : product.name_en}">
                ${product.discount ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
                ${product.freeShipping ? '<div class="free-shipping-badge">ফ্রি শিপিং</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${currentLanguage === 'bn' ? product.name : product.name_en}</h3>
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
                    <button class="btn-cart" onclick="addToCart(${product.id})">${translations[currentLanguage].addToCart}</button>
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
    // Load saved language preference
    const savedLanguage = localStorage.getItem('nurLanguage') || 'bn';
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        switchLanguage(savedLanguage);
    }
    
    updateCartCount();
    loadFeaturedProducts();
    showSlide(0);
    
    // Language switch event
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            switchLanguage(this.value);
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
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
});

// Rest of the Firebase functions remain the same...
// (signUp, signIn, addProduct, getProducts, etc.)
