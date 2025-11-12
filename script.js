// script.js
import { banners, products } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Shared functionality
  updateCartCount();

  // Page specific logic
  if (document.querySelector('#hero-banner')) {
    initHomePage();
  }
  if (document.querySelector('#all-products-grid')) {
    initProductsPage();
  }
  if (document.querySelector('#product-details-content')) {
    initProductDetailsPage();
  }
  if (document.querySelector('.cart-container')) {
    initCartPage();
  }
});

// --- Cart Management ---
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const cart = getCart();
  const product = products.find(p => p.id === productId);
  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  alert(`${product.name} কার্টে যোগ করা হয়েছে!`);
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalItems;
  });
}

// --- Reusable Render Functions ---
function renderProductCard(product) {
  const discountedPrice = product.price - (product.price * product.discount) / 100;
  
  return `
    <div class="product-card">
      ${product.discount > 0 ? `<div class="product-badge">${product.discount}% ছাড়</div>` : ''}
      ${product.freeShipping ? `<div class="product-badge" style="left: auto; right: 15px; background: #27ae60;">ফ্রি শিপিং</div>` : ''}
      
      <a href="product.html?id=${product.id}" class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="product-info">
        <h3><a href="product.html?id=${product.id}" style="text-decoration:none; color:inherit;">${product.name}</a></h3>
        <div class="product-price">
          ${product.discount > 0 ? `
            <span class="original">৳${product.price}</span>
            <span class="discounted">৳${discountedPrice.toFixed(2)}</span>
          ` : `
            <span class="discounted">৳${product.price}</span>
          `}
        </div>
        <div class="product-rating">
          ${'⭐'.repeat(Math.round(product.rating))} (${product.rating})
        </div>
        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">কার্টে যোগ করুন</button>
      </div>
    </div>
  `;
}

// --- Home Page Logic ---
function initHomePage() {
  // Banner Slider
  const bannerContainer = document.getElementById('hero-banner');
  let currentSlide = 0;

  function showSlide(index) {
    bannerContainer.innerHTML = `
      <div class="slide active">
        <img src="${banners[index].image}" alt="Banner Image">
        <div class="slide-content">
            <h1>${banners[index].title}</h1>
            <p>${banners[index].subtitle}</p>
        </div>
      </div>
    `;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % banners.length;
    showSlide(currentSlide);
  }

  showSlide(currentSlide);
  setInterval(nextSlide, 3000); // পরিবর্তিত হয়ে ৩ সেকেন্ড করা হলো

  // Featured Products
  const featuredGrid = document.getElementById('featured-product-grid');
  const featuredProducts = products.slice(0, 4); // প্রথম ৪টি পণ্য দেখাবে
  featuredGrid.innerHTML = featuredProducts.map(renderProductCard).join('');

  addCartButtonListeners();
}

// --- Products Page Logic ---
function initProductsPage() {
  const productsGrid = document.getElementById('all-products-grid');
  const categoryFilter = document.getElementById('category-filter');

  function displayProducts(filter = 'all') {
    const filteredProducts = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter);
      
    productsGrid.innerHTML = filteredProducts.map(renderProductCard).join('');
    addCartButtonListeners();
  }

  categoryFilter.addEventListener('change', (e) => {
    displayProducts(e.target.value);
  });

  displayProducts(); // initial display
}

// --- Product Details Page Logic ---
function initProductDetailsPage() {
  const content = document.getElementById('product-details-content');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  const product = products.find(p => p.id === productId);

  if (!product) {
    content.innerHTML = `<p>দুঃখিত, পণ্যটি খুঁজে পাওয়া যায়নি।</p>`;
    return;
  }
  
  const discountedPrice = product.price - (product.price * product.discount) / 100;

  content.innerHTML = `
    <div class="product-details-container">
      <div class="product-details-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-details-info">
        <h1>${product.name}</h1>
        <div class="product-price">
            ${product.discount > 0 ? `
              <span class="original">৳${product.price}</span>
              <span class="discounted">৳${discountedPrice.toFixed(2)}</span>
            ` : `
              <span class="discounted">৳${product.price}</span>
            `}
        </div>
        <div class="product-rating">
            ${'⭐'.repeat(Math.round(product.rating))} (${product.rating} | ${product.reviews} টি রিভিউ)
        </div>
        <p class="description">${product.description}</p>
        ${product.freeShipping ? `<p style="color: #27ae60; font-weight: bold;">✅ ফ্রি হোম ডেলিভারি!</p>` : ''}
        
        <div class="product-actions">
          <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">কার্টে যোগ করুন</button>
          <a href="products.html" class="btn">সব পণ্য দেখুন</a>
        </div>
      </div>
    </div>
  `;

  addCartButtonListeners();
}


// --- Cart Page Logic ---
function initCartPage() {
    const itemsContainer = document.getElementById('cart-items-container');
    const summaryContainer = document.getElementById('cart-summary-container');
    const cart = getCart();

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p>আপনার কার্ট খালি।</p>';
        summaryContainer.style.display = 'none';
        return;
    }

    itemsContainer.innerHTML = cart.map(item => {
        const itemDiscountedPrice = item.price - (item.price * item.discount) / 100;
        const finalPrice = item.discount > 0 ? itemDiscountedPrice : item.price;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>দাম: ৳${finalPrice.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
                </div>
                <button class="btn remove-from-cart-btn" data-id="${item.id}">মুছুন</button>
            </div>
        `;
    }).join('');

    updateCartSummary();

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            let cart = getCart();
            const item = cart.find(i => i.id === id);
            if (item && newQuantity > 0) {
                item.quantity = newQuantity;
                saveCart(cart);
                initCartPage(); // Re-render the whole cart
            }
        });
    });

    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            let cart = getCart();
            cart = cart.filter(item => item.id !== id);
            saveCart(cart);
            initCartPage(); // Re-render
        });
    });
}

function updateCartSummary() {
    const summaryContainer = document.getElementById('cart-summary-container');
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => {
        const itemDiscountedPrice = item.price - (item.price * item.discount) / 100;
        const finalPrice = item.discount > 0 ? itemDiscountedPrice : item.price;
        return sum + (finalPrice * item.quantity);
    }, 0);

    const deliveryCharge = 120;
    const total = subtotal + deliveryCharge;

    summaryContainer.innerHTML = `
        <h3>অর্ডার সারাংশ</h3>
        <div class="summary-row">
            <span>সাবটোটাল</span>
            <span>৳${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>ডেলিভারি চার্জ</span>
            <span>৳${deliveryCharge.toFixed(2)}</span>
        </div>
        <div class="summary-row summary-total">
            <span>সর্বমোট</span>
            <span>৳${total.toFixed(2)}</span>
        </div>
        <button class="btn btn-primary" id="checkout-btn" style="width: 100%; margin-top: 1rem;">অর্ডার কনফার্ম করুন (COD)</button>
    `;

    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('আপনার অর্ডার গ্রহণ করা হয়েছে ✅');
        saveCart([]); // Clear cart
        window.location.href = 'index.html';
    });
}


// --- Generic Event Listeners ---
function addCartButtonListeners() {
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      addToCart(productId);
    });
  });
}
