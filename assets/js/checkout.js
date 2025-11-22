// Checkout Page Functions with Online Payment
let currentOrder = {
    items: [],
    subtotal: 0,
    shipping: 120,
    discount: 0,
    total: 0,
    pointsUsed: 0,
    pointsDiscount: 0,
    paymentMethod: 'cod'
};

// Initialize Checkout Page
function initCheckoutPage() {
    loadOrderSummary();
    setupEventListeners();
    validateForm();
}

// Load Order Summary
function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('nurCart')) || [];
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    currentOrder.items = cart;
    currentOrder.subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    currentOrder.shipping = currentOrder.subtotal > 1000 ? 0 : 120;
    currentOrder.total = currentOrder.subtotal + currentOrder.shipping;

    displayOrderItems();
    updateOrderSummary();
}

// Display Order Items
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;

    orderItemsContainer.innerHTML = '';

    currentOrder.items.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-image">
                <i class="fas fa-image"></i>
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">৳${item.price.toLocaleString()}</div>
                <div class="order-item-quantity">পরিমাণ: ${item.quantity}</div>
                ${item.size ? `<div class="order-item-size">সাইজ: ${item.size}</div>` : ''}
                ${item.color ? `<div class="order-item-color">রং: ${item.color}</div>` : ''}
            </div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
}

// Update Order Summary
function updateOrderSummary() {
    const subtotalElement = document.getElementById('summarySubtotal');
    const shippingElement = document.getElementById('summaryShipping');
    const discountElement = document.getElementById('summaryDiscount');
    const totalElement = document.getElementById('summaryTotal');

    if (subtotalElement) subtotalElement.textContent = `৳${currentOrder.subtotal.toLocaleString()}`;
    if (shippingElement) shippingElement.textContent = currentOrder.shipping === 0 
        ? 'ফ্রি' 
        : `৳${currentOrder.shipping.toLocaleString()}`;
    if (discountElement) discountElement.textContent = `-৳${currentOrder.pointsDiscount.toLocaleString()}`;
    
    const finalTotal = Math.max(0, currentOrder.total - currentOrder.pointsDiscount);
    if (totalElement) totalElement.textContent = `৳${finalTotal.toLocaleString()}`;
}

// Apply Points Discount
function applyPoints(discountAmount) {
    currentOrder.pointsDiscount = discountAmount;
    updateOrderSummary();
}

// Select Payment Method
function selectPayment(method) {
    // Update UI
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Show/hide card form
    const cardForm = document.getElementById('cardPaymentForm');
    if (cardForm) {
        if (method === 'card') {
            cardForm.classList.add('active');
        } else {
            cardForm.classList.remove('active');
        }
    }
    
    currentOrder.paymentMethod = method;
    validateForm();
}

// Setup Event Listeners
function setupEventListeners() {
    // Form validation on input
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let matches = value.match(/\d{4,16}/g);
            let match = matches && matches[0] || '';
            let parts = [];
            
            for (let i=0; i<match.length; i+=4) {
                parts.push(match.substring(i, i+4));
            }
            
            if (parts.length) {
                e.target.value = parts.join(' ');
            } else {
                e.target.value = value;
            }
        });
    }

    // Expiry date formatting
    const expiry = document.getElementById('expiry');
    if (expiry) {
        expiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
        });
    }

    // CVV formatting
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
}

// Validate Form
function validateForm() {
    const requiredFields = document.querySelectorAll('#fullName, #email, #phone, #address, #city, #zip, #country');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
        }
    });

    // Validate email
    const email = document.getElementById('email');
    if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            isValid = false;
        }
    }

    // Validate phone
    const phone = document.getElementById('phone');
    if (phone && phone.value) {
        const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(phone.value.replace(/\D/g, ''))) {
            isValid = false;
        }
    }

    // Validate card details if card payment selected
    if (currentOrder.paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber');
        const expiry = document.getElementById('expiry');
        const cvv = document.getElementById('cvv');
        const cardName = document.getElementById('cardName');

        if (!cardNumber || !cardNumber.value.replace(/\s/g, '').match(/^\d{16}$/)) {
            isValid = false;
        }
        if (!expiry || !expiry.value.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
            isValid = false;
        }
        if (!cvv || !cvv.value.match(/^\d{3}$/)) {
            isValid = false;
        }
        if (!cardName || !cardName.value.trim()) {
            isValid = false;
        }
    }

    if (placeOrderBtn) {
        placeOrderBtn.disabled = !isValid;
    }
    
    return isValid;
}

// Place Order with Online Payment
async function placeOrder() {
    if (!validateForm()) {
        showToast('সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন');
        return;
    }

    // Show loading
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'অর্ডার প্রসেস হচ্ছে...';
    }

    // Collect order data
    const orderData = {
        items: currentOrder.items,
        shippingInfo: {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value
        },
        paymentMethod: currentOrder.paymentMethod,
        orderSummary: {
            subtotal: currentOrder.subtotal,
            shipping: currentOrder.shipping,
            pointsDiscount: currentOrder.pointsDiscount,
            total: Math.max(0, currentOrder.total - currentOrder.pointsDiscount)
        },
        status: 'pending',
        orderDate: new Date().toISOString(),
        orderNumber: generateOrderNumber()
    };

    try {
        if (currentOrder.paymentMethod === 'card') {
            // Process online payment
            await processOnlinePayment(orderData);
        } else {
            // Process COD order
            await processCODOrder(orderData);
        }
    } catch (error) {
        console.error('Order processing error:', error);
        showToast('অর্ডার প্রসেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        
        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'অর্ডার নিশ্চিত করুন';
        }
    }
}

// Process Online Payment (SSLCOMMERZ Integration)
async function processOnlinePayment(orderData) {
    try {
        // SSLCOMMERZ Payment Integration
        const paymentData = {
            store_id: 'nur64f8d8c8f0b0e',
            store_passwd: 'nur64f8d8c8f0b0e@ssl',
            total_amount: orderData.orderSummary.total,
            currency: 'BDT',
            tran_id: orderData.orderNumber,
            success_url: `${window.location.origin}/payment-success.html?order=${orderData.orderNumber}`,
            fail_url: `${window.location.origin}/payment-failed.html?order=${orderData.orderNumber}`,
            cancel_url: `${window.location.origin}/checkout.html`,
            cus_name: orderData.shippingInfo.fullName,
            cus_email: orderData.shippingInfo.email,
            cus_phone: orderData.shippingInfo.phone,
            cus_add1: orderData.shippingInfo.address,
            cus_city: orderData.shippingInfo.city,
            cus_postcode: orderData.shippingInfo.zip,
            cus_country: 'Bangladesh',
            shipping_method: 'Courier',
            product_name: 'NUR Shopping Order',
            product_category: 'General',
            product_profile: 'general'
        };

        // Save order to localStorage temporarily
        localStorage.setItem(`pendingOrder_${orderData.orderNumber}`, JSON.stringify(orderData));
        
        // Redirect to SSLCOMMERZ payment page
        redirectToSSLCommerz(paymentData);
        
    } catch (error) {
        throw new Error('Payment processing failed');
    }
}

// Redirect to SSLCOMMERZ
function redirectToSSLCommerz(paymentData) {
    // In production, you would make an API call to your backend
    // For demo, we'll simulate the redirect
    
    showToast('পেমেন্ট গেটওয়ে এ রিডাইরেক্ট হচ্ছে...');
    
    setTimeout(() => {
        // Simulate successful payment for demo
        simulatePaymentSuccess(paymentData.tran_id);
    }, 2000);
}

// Simulate Payment Success (Remove this in production)
function simulatePaymentSuccess(orderNumber) {
    const pendingOrder = JSON.parse(localStorage.getItem(`pendingOrder_${orderNumber}`));
    
    if (pendingOrder) {
        // Save to orders
        const orders = JSON.parse(localStorage.getItem('nurOrders')) || [];
        pendingOrder.status = 'confirmed';
        pendingOrder.paymentStatus = 'paid';
        pendingOrder.paymentDate = new Date().toISOString();
        orders.push(pendingOrder);
        localStorage.setItem('nurOrders', JSON.stringify(orders));
        
        // Clear cart and pending order
        localStorage.removeItem('nurCart');
        localStorage.removeItem(`pendingOrder_${orderNumber}`);
        
        showToast('পেমেন্ট সফল! অর্ডার নিশ্চিত করা হয়েছে।');
        
        setTimeout(() => {
            window.location.href = `order-success.html?order=${orderNumber}`;
        }, 1500);
    }
}

// Process COD Order
async function processCODOrder(orderData) {
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('nurOrders')) || [];
    orderData.status = 'confirmed';
    orderData.paymentStatus = 'pending';
    orders.push(orderData);
    localStorage.setItem('nurOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('nurCart');
    
    showToast('অর্ডার সফলভাবে তৈরি হয়েছে!');
    
    setTimeout(() => {
        window.location.href = `order-success.html?order=${orderData.orderNumber}`;
    }, 1500);
}

// Generate Order Number
function generateOrderNumber() {
    return 'NUR' + Date.now().toString().slice(-8);
}

// Show Toast Message
function showToast(message) {
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
    
    setTimeout(() => {
        if (toast.parentNode) {
            document.body.removeChild(toast);
        }
    }, 3000);
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('orderItems')) {
        initCheckoutPage();
    }
});

// Export functions for global use
window.applyPoints = applyPoints;
window.selectPayment = selectPayment;
window.placeOrder = placeOrder;
window.performSearch = performSearch;
window.toggleAuthModal = toggleAuthModal;
