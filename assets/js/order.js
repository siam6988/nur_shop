// Order Management Functions
let currentOrder = {
    items: [],
    subtotal: 0,
    shipping: 120,
    discount: 0,
    total: 0,
    pointsUsed: 0,
    pointsDiscount: 0
};

// Initialize Checkout Page
function initCheckoutPage() {
    loadOrderSummary();
    setupCheckoutEventListeners();
    checkAuthentication();
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
                <img src="${item.image}" alt="${currentLanguage === 'bn' ? item.name : item.name_en}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Mzk5YTciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4='">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${currentLanguage === 'bn' ? item.name : item.name_en}</div>
                <div class="order-item-price">৳${item.price.toLocaleString()}</div>
                <div class="order-item-quantity">পরিমাণ: ${item.quantity}</div>
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
        ? (currentLanguage === 'bn' ? 'ফ্রি' : 'Free') 
        : `৳${currentOrder.shipping.toLocaleString()}`;
    if (discountElement) discountElement.textContent = `-৳${currentOrder.pointsDiscount.toLocaleString()}`;
    if (totalElement) totalElement.textContent = `৳${currentOrder.total.toLocaleString()}`;
}

// Apply Points Discount
function applyPoints(discountAmount) {
    currentOrder.pointsDiscount = discountAmount;
    currentOrder.total = (currentOrder.subtotal + currentOrder.shipping) - discountAmount;
    
    // Ensure total doesn't go below 0
    if (currentOrder.total < 0) {
        currentOrder.total = 0;
        currentOrder.pointsDiscount = currentOrder.subtotal + currentOrder.shipping;
    }
    
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
        cardForm.style.display = method === 'card' ? 'block' : 'none';
    }
    
    currentOrder.paymentMethod = method;
}

// Setup Checkout Event Listeners
function setupCheckoutEventListeners() {
    // Form validation
    const form = document.querySelector('.checkout-forms');
    if (form) {
        form.addEventListener('input', validateForm);
    }

    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(el => {
        el.addEventListener('click', function() {
            selectPayment(this.querySelector('input').id);
        });
    });
}

// Validate Form
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
        }
    });
    
    if (placeOrderBtn) {
        placeOrderBtn.disabled = !isValid;
    }
    
    return isValid;
}

// Check Authentication
function checkAuthentication() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            showToast(currentLanguage === 'bn' ? 'চেকআউট করতে লগইন করুন' : 'Please login to checkout');
            window.location.href = 'auth.html?redirect=checkout';
        }
    });
}

// Place Order
function placeOrder() {
    if (!validateForm()) {
        showToast(currentLanguage === 'bn' ? 'সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please fill all required fields');
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        showToast(currentLanguage === 'bn' ? 'লগইন প্রয়োজন' : 'Login required');
        return;
    }

    // Collect form data
    const orderData = {
        userId: user.uid,
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
        paymentMethod: currentOrder.paymentMethod || 'cod',
        orderSummary: {
            subtotal: currentOrder.subtotal,
            shipping: currentOrder.shipping,
            pointsDiscount: currentOrder.pointsDiscount,
            total: currentOrder.total
        },
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Show loading
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = currentLanguage === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...';
    }

    // Save order to Firestore
    db.collection('orders').add(orderData)
        .then((docRef) => {
            console.log('Order created with ID: ', docRef.id);
            
            // Clear cart
            localStorage.removeItem('nurCart');
            
            // Update user points if used
            if (currentOrder.pointsDiscount > 0) {
                updateUserPoints(user.uid, -calculatePointsUsed(currentOrder.pointsDiscount));
            }
            
            // Show success message
            showToast(currentLanguage === 'bn' ? 'অর্ডার সফলভাবে তৈরি হয়েছে!' : 'Order created successfully!');
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = `orders.html?order=${docRef.id}`;
            }, 2000);
            
        })
        .catch((error) => {
            console.error('Error creating order: ', error);
            showToast(currentLanguage === 'bn' ? 'অর্ডার তৈরি করতে সমস্যা হয়েছে' : 'Error creating order');
            
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = currentLanguage === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Place Order';
            }
        });
}

// Calculate points used based on discount
function calculatePointsUsed(discount) {
    // Simple conversion - in real app, this would use the point rules
    if (discount >= 200) return 100;
    if (discount >= 80) return 50;
    if (discount >= 25) return 20;
    if (discount >= 10) return 10;
    return 0;
}

// Update user points
function updateUserPoints(userId, points) {
    db.collection('users').doc(userId).update({
        points: firebase.firestore.FieldValue.increment(points)
    })
    .then(() => {
        console.log('User points updated');
    })
    .catch((error) => {
        console.error('Error updating user points: ', error);
    });
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
