// Product Detail Page Functions
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let currentQuantity = 1;

// Initialize Product Detail Page
function initProductDetailPage() {
    loadProductData();
    setupEventListeners();
    updateCartCount();
}

// Load Product Data from URL parameter
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1'; // Default to product ID 1

    // In real app, this would fetch from Firestore
    // For demo, we'll use sample data
    const product = getProductById(parseInt(productId));
    
    if (product) {
        currentProduct = product;
        displayProductDetails();
        loadRelatedProducts();
    } else {
        // Product not found, redirect to shop
        window.location.href = 'shop.html';
    }
}

// Get Product by ID (Sample Data)
function getProductById(id) {
    const products = {
        1: {
            id: 1,
            name: "D20 Smart Watch Sport Fitness Tracker",
            name_en: "D20 Smart Watch Sport Fitness Tracker",
            brand: "স্মার্ট টেক",
            price: 121.43,
            originalPrice: 766.07,
            discount: 72,
            rating: 4.2,
            reviews: 150,
            sold: 600,
            category: "electronics",
            images: [
                "assets/img/products/smartwatch.jpg",
                "assets/img/products/smartwatch-2.jpg",
                "assets/img/products/smartwatch-3.jpg"
            ],
            sizes: ["ফ্রি সাইজ", "স্মল", "মিডিয়াম", "লার্জ"],
            colors: ["#000000", "#1e40af", "#dc2626", "#7c3aed"],
            stock: 45,
            description: "D20 স্মার্ট ওয়াচ - আপনার ব্যক্তিগত ফিটনেস ট্র্যাকার",
            specifications: {
                brand: "স্মার্ট টেক",
                model: "D20 স্মার্ট ওয়াচ",
                screen: "১.৬৯ ইঞ্চি HD",
                connectivity: "ব্লুটুথ ৫.০",
                battery: "২১০mAh, ৭ দিন স্ট্যান্ডবাই",
                waterproof: "IP67 রেটিং",
                compatibility: "Android & iOS",
                colors: "ব্ল্যাক, ব্লু, পিঙ্ক",
                warranty: "১ বছর সার্ভিস ওয়ারেন্টি"
            }
        },
        2: {
            id: 2,
            name: "HD Monocular Telescope",
            name_en: "HD Monocular Telescope",
            brand: "অপটিক্যাল টেক",
            price: 121.43,
            originalPrice: 441.57,
            discount: 72,
            rating: 4.0,
            reviews: 286,
            sold: 1000,
            category: "electronics",
            images: [
                "assets/img/products/telescope.jpg"
            ],
            sizes: ["স্ট্যান্ডার্ড"],
            colors: ["#000000", "#374151"],
            stock: 23,
            description: "২৮০x২৪ HD মনোকুলার টেলিস্কোপ",
            specifications: {
                magnification: "২৮০x",
                lens: "২৪mm HD",
                nightVision: "হ্যাঁ",
                weight: "২০০g",
                usage: "অপটিক্যাল, এডভেঞ্চার"
            }
        }
    };

    return products[id];
}

// Display Product Details
function displayProductDetails() {
    if (!currentProduct) return;

    // Update basic info
    document.getElementById('productTitle').textContent = currentLanguage === 'bn' ? currentProduct.name : currentProduct.name_en;
    document.getElementById('productBrand').textContent = `ব্র্যান্ড: ${currentProduct.brand}`;
    document.getElementById('productRating').textContent = currentProduct.rating;
    document.getElementById('reviewCount').textContent = `(${currentProduct.reviews}+ রিভিউ)`;
    document.getElementById('soldCount').textContent = `${currentProduct.sold}+ বিক্রিত`;

    // Update prices
    document.getElementById('currentPrice').textContent = `৳${currentProduct.price.toLocaleString()}`;
    document.getElementById('originalPrice').textContent = `৳${currentProduct.originalPrice.toLocaleString()}`;
    document.getElementById('discountBadge').textContent = `-${currentProduct.discount}%`;

    // Update stock info
    document.getElementById('stockInfo').innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>স্টকে আছে (${currentProduct.stock})</span>
    `;

    // Load images
    loadProductImages();

    // Load size options
    loadSizeOptions();

    // Load color options
    loadColorOptions();

    // Update quantity input max
    document.getElementById('quantityInput').max = currentProduct.stock;
}

// Load Product Images
function loadProductImages() {
    const thumbnailsContainer = document.getElementById('imageThumbnails');
    const mainImage = document.getElementById('mainProductImage');

    if (!thumbnailsContainer || !mainImage) return;

    thumbnailsContainer.innerHTML = '';
    
    currentProduct.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `
            <img src="${image}" alt="Thumbnail ${index + 1}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Mzk5YTciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4='">
        `;
        thumbnail.onclick = () => changeMainImage(image, index);
        thumbnailsContainer.appendChild(thumbnail);
    });

    // Set first image as main
    if (currentProduct.images.length > 0) {
        mainImage.src = currentProduct.images[0];
    }
}

// Change Main Image
function changeMainImage(imageUrl, index) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (mainImage) {
        mainImage.src = imageUrl;
    }

    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Load Size Options
function loadSizeOptions() {
    const sizeOptionsContainer = document.getElementById('sizeOptions');
    if (!sizeOptionsContainer) return;

    sizeOptionsContainer.innerHTML = '';

    currentProduct.sizes.forEach((size, index) => {
        const sizeOption = document.createElement('div');
        sizeOption.className = `size-option ${index === 0 ? 'selected' : ''}`;
        sizeOption.textContent = size;
        sizeOption.onclick = () => selectSize(size, sizeOption);
        sizeOptionsContainer.appendChild(sizeOption);
    });

    // Set first size as selected
    if (currentProduct.sizes.length > 0) {
        selectedSize = currentProduct.sizes[0];
    }
}

// Select Size
function selectSize(size, element) {
    selectedSize = size;
    
    // Update UI
    document.querySelectorAll('.size-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
}

// Load Color Options
function loadColorOptions() {
    const colorOptionsContainer = document.getElementById('colorOptions');
    if (!colorOptionsContainer) return;

    colorOptionsContainer.innerHTML = '';

    currentProduct.colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = `color-option ${index === 0 ? 'selected' : ''}`;
        colorOption.style.backgroundColor = color;
        colorOption.onclick = () => selectColor(color, colorOption);
        colorOptionsContainer.appendChild(colorOption);
    });

    // Set first color as selected
    if (currentProduct.colors.length > 0) {
        selectedColor = currentProduct.colors[0];
    }
}

// Select Color
function selectColor(color, element) {
    selectedColor = color;
    
    // Update UI
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
}

// Quantity Controls
function increaseQuantity() {
    const quantityInput = document.getElementById('quantityInput');
    const currentValue = parseInt(quantityInput.value);
    const max = parseInt(quantityInput.max);

    if (currentValue < max) {
        quantityInput.value = currentValue + 1;
        currentQuantity = quantityInput.value;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantityInput');
    const currentValue = parseInt(quantityInput.value);

    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        currentQuantity = quantityInput.value;
    }
}

// Add to Cart
function addToCart() {
    if (!currentProduct) return;

    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        name_en: currentProduct.name_en,
        price: currentProduct.price,
        image: currentProduct.images[0],
        quantity: currentQuantity,
        size: selectedSize,
        color: selectedColor
    };

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('nurCart')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );

    if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += currentQuantity;
    } else {
        // Add new item
        cart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('nurCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showToast(currentLanguage === 'bn' ? 'পণ্য কার্টে যোগ করা হয়েছে!' : 'Product added to cart!');
}

// Buy Now
function buyNow() {
    addToCart();
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1000);
}

// Toggle Wishlist
function toggleWishlist() {
    if (!currentProduct) return;

    const wishlistIcon = document.getElementById('wishlistIcon');
    let wishlist = JSON.parse(localStorage.getItem('nurWishlist')) || [];

    const existingIndex = wishlist.findIndex(item => item.id === currentProduct.id);

    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        wishlistIcon.className = 'far fa-heart';
        showToast(currentLanguage === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist');
    } else {
        // Add to wishlist
        wishlist.push({
            id: currentProduct.id,
            name: currentProduct.name,
            name_en: currentProduct.name_en,
            price: currentProduct.price,
            image: currentProduct.images[0]
        });
        wishlistIcon.className = 'fas fa-heart';
        showToast(currentLanguage === 'bn' ? 'উইশলিস্টে যোগ করা হয়েছে' : 'Added to wishlist');
    }

    localStorage.setItem('nurWishlist', JSON.stringify(wishlist));
}

// Load Related Products
function loadRelatedProducts() {
    const relatedContainer = document.getElementById('relatedProducts');
    if (!relatedContainer) return;

    // In real app, this would fetch related products from Firestore
    // For demo, we'll show some sample products
    const relatedProducts = [
        {
            id: 3,
            name: "নাইট ভিশন গ্লাসেস",
            name_en: "Night Vision Glasses",
            price: 112.85,
            originalPrice: 172.95,
            discount: 35,
            image: "assets/img/products/glasses.jpg",
            rating: 4.5,
            reviews: 299,
            freeShipping: true
        },
        {
            id: 4,
            name: "ফ্যাশন স্টেইনলেস স্টিল রিং",
            name_en: "Fashion Stainless Steel Ring",
            price: 361.49,
            originalPrice: 2239.62,
            discount: 83,
            image: "assets/img/products/ring.jpg",
            rating: 4.2,
            reviews: 150,
            freeShipping: true
        }
    ];

    relatedContainer.innerHTML = '';

    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image" onclick="window.location.href='product.html?id=${product.id}'">
                <div style="width:100%;height:200px;background:#f8fafc;display:flex;align-items:center;justify-content:center;color:#64748b;">
                    <i class="fas fa-image fa-2x"></i>
                </div>
                ${product.discount ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
                ${product.freeShipping ? '<div class="free-shipping-badge">ফ্রি শিপিং</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${currentLanguage === 'bn' ? product.name : product.name_en}</h3>
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
                    <button class="btn-cart" onclick="addRelatedToCart(${product.id})">কার্টে যোগ করুন</button>
                    <button class="btn-wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        relatedContainer.appendChild(productCard);
    });
}

// Add Related Product to Cart
function addRelatedToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const cartItem = {
        id: product.id,
        name: product.name,
        name_en: product.name_en,
        price: product.price,
        image: product.images[0],
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('nurCart')) || [];
    cart.push(cartItem);
    localStorage.setItem('nurCart', JSON.stringify(cart));
    
    updateCartCount();
    showToast(currentLanguage === 'bn' ? 'পণ্য কার্টে যোগ করা হয়েছে!' : 'Product added to cart!');
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');

    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const tabName = header.dataset.tab;
            
            // Update headers
            tabHeaders.forEach(h => h.classList.remove('active'));
            header.classList.add('active');
            
            // Update contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Quantity input change
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            const max = parseInt(this.max);
            const min = parseInt(this.min);

            if (value > max) {
                this.value = max;
            } else if (value < min) {
                this.value = min;
            }
            currentQuantity = this.value;
        });
    }

    // Check wishlist status
    checkWishlistStatus();
}

// Check if product is in wishlist
function checkWishlistStatus() {
    if (!currentProduct) return;

    const wishlist = JSON.parse(localStorage.getItem('nurWishlist')) || [];
    const isInWishlist = wishlist.some(item => item.id === currentProduct.id);
    const wishlistIcon = document.getElementById('wishlistIcon');

    if (wishlistIcon) {
        wishlistIcon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
    }
}

// Update Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('nurCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productTitle')) {
        initProductDetailPage();
    }
});

// Export functions for global use
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.toggleWishlist = toggleWishlist;
window.addRelatedToCart = addRelatedToCart;
