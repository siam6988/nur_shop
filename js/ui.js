const app = document.getElementById('app');

function createHeader(state) {
    return `
    <header class="header">
        <div class="nav-container">
            <a href="/#/" class="logo">Nur</a>
            <div class="header-actions">
                <a href="/#/cart" class="icon-btn">
                    <img src="assets/icons/cart.svg" alt="Cart">
                    <span class="cart-badge">${state.cart.length}</span>
                </a>
                <a href="/#/account" class="icon-btn">
                    <img src="assets/icons/user.svg" alt="Account">
                </a>
            </div>
        </div>
    </header>
    `;
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <a href="/#/products/${product.id}">
                <img src="${product.images[0]}" alt="${product.title_bn}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title_bn}</h3>
                    <p class="product-price">৳ ${product.price}</p>
                </div>
            </a>
        </div>
    `;
}

export function renderHomePage(products) {
    app.innerHTML = `
        ${createHeader({ cart: [] })} <!-- Update cart from state -->
        <main class="container">
            <h1 class="section-title">আমাদের সেরা কালেকশন</h1>
            <div class="product-grid">
                ${products.map(createProductCard).join('')}
            </div>
        </main>
    `;
}

export function renderProductDetailsPage(product) {
     app.innerHTML = `
        ${createHeader({ cart: [] })} <!-- Update cart from state -->
        <main class="container">
            <a href="/#/" class="back-link"> &larr; সব প্রোডাক্ট দেখুন</a>
            <div class="product-details-layout">
                 <img src="${product.images[0]}" alt="${product.title_bn}" class="product-details-image">
                 <div class="product-details-info">
                    <h1>${product.title_bn}</h1>
                    <p class="price">৳ ${product.price}</p>
                    <p>${product.description_bn || 'বিস্তারিত তথ্য যোগ করা হয়নি।'}</p>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">কার্টে যোগ করুন</button>
                 </div>
            </div>
        </main>
    `;
}

export function renderLoginPage() {
    app.innerHTML = `
    <div class="auth-container">
        <h1 class="auth-title">স্বাগতম!</h1>
        <p>আপনার অ্যাকাউন্টে লগইন করুন।</p>
        <form id="login-form">
            <div class="form-group">
                <input type="email" id="login-email" class="form-input" placeholder="ইমেইল" required>
            </div>
            <div class="form-group">
                <input type="password" id="login-password" class="form-input" placeholder="পাসওয়ার্ড" required>
            </div>
            <button type="submit" class="btn btn-primary">লগইন</button>
        </form>
        <p class="auth-switch">অ্যাকাউন্ট নেই? <a href="/#/signup">সাইন আপ করুন</a></p>
    </div>
    `;
}

// Add renderSignUpPage, renderCartPage etc. following the same pattern
