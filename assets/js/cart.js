// Cart Management
class NURCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('nur_cart')) || [];
        this.deliveryCharge = 120;
        this.init();
    }

    init() {
        this.renderCartItems();
        this.setupCartInteractions();
        this.updateCartSummary();
    }

    renderCartItems() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <h3>Your cart is empty</h3>
                    <p>Cart এ আছে? তাহলে আর লুকিও না, Checkout করে ফেলো!</p>
                    <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-cart-id="${item.cartId}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    ${item.selectedSize ? `<div class="item-variant">Color: ${item.selectedSize}</div>` : ''}
                    <div class="item-price">৳ ${item.price.toLocaleString()}</div>
                    ${item.freeShipping ? `<div class="free-shipping">FREE Shipping</div>` : ''}
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" onclick="nurCart.updateQuantity('${item.cartId}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" onclick="nurCart.updateQuantity('${item.cartId}', ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">
                    ৳ ${(item.price * item.quantity).toLocaleString()}
                </div>
                <button class="remove-item" onclick="nurCart.removeItem('${item.cartId}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    setupCartInteractions() {
        // Continue shopping button
        const continueBtn = document.querySelector('.continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                window.location.href = 'shop.html';
            });
        }

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }

        // Apply coupon
        const applyCouponBtn = document.querySelector('.apply-coupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                this.applyCoupon();
            });
        }

        // Use points
        const usePointsCheckbox = document.querySelector('.use-points');
        if (usePointsCheckbox) {
            usePointsCheckbox.addEventListener('change', (e) => {
                this.togglePointsUsage(e.target.checked);
            });
        }
    }

    updateQuantity(cartId, newQuantity) {
        if (newQuantity < 1) return;
        
        const item = this.cart.find(item => item.cartId == cartId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCartItems();
            this.updateCartSummary();
            this.updateCartCount();
        }
    }

    removeItem(cartId) {
        this.cart = this.cart.filter(item => item.cartId != cartId);
        this.saveCart();
        this.renderCartItems();
        this.updateCartSummary();
        this.updateCartCount();
        this.showToast('Product removed from cart');
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + this.deliveryCharge;

        const subtotalEl = document.getElementById('cart-subtotal');
        const deliveryEl = document.getElementById('cart-delivery');
        const totalEl = document.getElementById('cart-total');

        if (subtotalEl) subtotalEl.textContent = `৳ ${subtotal.toLocaleString()}`;
        if (deliveryEl) deliveryEl.textContent = `৳ ${this.deliveryCharge.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `৳ ${total.toLocaleString()}`;

        // Update checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
            checkoutBtn.textContent = this.cart.length === 0 ? 
                'Cart is Empty' : 
                `Proceed to Checkout (৳ ${total.toLocaleString()})`;
        }
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });

        // Update main app if available
        if (window.nurApp) {
            window.nurApp.updateCartCount();
        }
    }

    applyCoupon() {
        const couponInput = document.querySelector('.coupon-input');
        if (!couponInput) return;

        const couponCode = couponInput.value.trim();
        if (!couponCode) {
            this.showToast('Please enter a coupon code', 'warning');
            return;
        }

        // Simulate coupon validation
        const validCoupons = {
            'WELCOME10': 10,
            'SUMMER25': 25,
            'NUR50': 50
        };

        if (validCoupons[couponCode]) {
            const discount = validCoupons[couponCode];
            this.showToast(`Coupon applied! ${discount}% discount`, 'success');
            // Apply discount logic would go here
        } else {
            this.showToast('Invalid coupon code', 'error');
        }

        couponInput.value = '';
    }

    togglePointsUsage(usePoints) {
        if (usePoints) {
            const user = JSON.parse(localStorage.getItem('nur_user'));
            if (!user) {
                this.showToast('Please login to use points', 'warning');
                document.querySelector('.use-points').checked = false;
                return;
            }

            const points = user.points || 0;
            if (points < 10) {
                this.showToast('Minimum 10 points required', 'warning');
                document.querySelector('.use-points').checked = false;
                return;
            }

            this.showToast(`Using ${points} loyalty points`, 'info');
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty', 'warning');
            return;
        }

        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('nur_user'));
        if (!user) {
            this.showToast('Please login to checkout', 'warning');
            window.location.href = 'auth.html?redirect=checkout';
            return;
        }

        window.location.href = 'checkout.html';
    }

    saveCart() {
        localStorage.setItem('nur_cart', JSON.stringify(this.cart));
    }

    showToast(message, type = 'success') {
        if (window.nurApp) {
            window.nurApp.showToast(message, type);
        } else {
            // Fallback toast implementation
            console.log(`${type}: ${message}`);
        }
    }

    // Public methods for HTML onclick
    updateQuantity(cartId, quantity) {
        this.updateQuantity(cartId, quantity);
    }

    removeItem(cartId) {
        this.removeItem(cartId);
    }
}

// Initialize cart
const nurCart = new NURCart();
