// Order Management
class NUROrder {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('nur_orders')) || [];
        this.currentOrder = null;
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupOrderInteractions();
    }

    loadOrders() {
        const ordersContainer = document.getElementById('orders-list');
        if (!ordersContainer) return;

        if (this.orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <h3>No orders yet</h3>
                    <p>You haven't placed any orders yet</p>
                    <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }

        ordersContainer.innerHTML = this.orders.map(order => `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order #${order.id}</h3>
                        <span class="order-date">Placed on ${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div class="order-status ${order.status}">
                        ${this.getStatusText(order.status)}
                    </div>
                </div>
                
                <div class="order-items">
                    ${order.items.slice(0, 2).map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="item-info">
                                <h4>${item.name}</h4>
                                <div class="item-price">৳ ${item.price.toLocaleString()} x ${item.quantity}</div>
                            </div>
                        </div>
                    `).join('')}
                    ${order.items.length > 2 ? `
                        <div class="more-items">+${order.items.length - 2} more items</div>
                    ` : ''}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        Total: ৳ ${order.total.toLocaleString()}
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline" onclick="nurOrder.viewOrder('${order.id}')">
                            View Details
                        </button>
                        ${order.status === 'delivered' ? `
                            <button class="btn btn-primary" onclick="nurOrder.rateOrder('${order.id}')">
                                Rate & Review
                            </button>
                        ` : ''}
                        ${order.status === 'pending' ? `
                            <button class="btn btn-danger" onclick="nurOrder.cancelOrder('${order.id}')">
                                Cancel Order
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupOrderInteractions() {
        // Track order button
        const trackOrderBtn = document.querySelector('.track-order-btn');
        if (trackOrderBtn) {
            trackOrderBtn.addEventListener('click', () => {
                this.trackOrder();
            });
        }

        // Place order button (from checkout)
        const placeOrderBtn = document.querySelector('.place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                this.placeOrder();
            });
        }
    }

    placeOrder() {
        const cart = JSON.parse(localStorage.getItem('nur_cart')) || [];
        if (cart.length === 0) {
            this.showToast('Your cart is empty', 'warning');
            return;
        }

        const user = JSON.parse(localStorage.getItem('nur_user'));
        if (!user) {
            this.showToast('Please login to place order', 'warning');
            return;
        }

        // Get shipping info
        const shippingInfo = this.getShippingInfo();
        if (!shippingInfo) return;

        // Create order
        const order = {
            id: 'NUR' + Date.now(),
            date: new Date().toISOString(),
            status: 'pending',
            items: cart,
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            delivery: 120,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 120,
            shipping: shippingInfo,
            paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'cod'
        };

        // Add to orders
        this.orders.unshift(order);
        localStorage.setItem('nur_orders', JSON.stringify(this.orders));

        // Clear cart
        localStorage.removeItem('nur_cart');
        if (window.nurApp) {
            window.nurApp.cart = [];
            window.nurApp.updateCartCount();
        }

        // Show success message
        this.showToast('Order placed successfully!', 'success');
        
        // Redirect to order confirmation
        setTimeout(() => {
            window.location.href = `order-confirmation.html?id=${order.id}`;
        }, 1500);
    }

    getShippingInfo() {
        // This would typically get data from checkout form
        return {
            name: "John Doe",
            phone: "+8801234567890",
            address: "123 Main Street, Dhaka",
            city: "Dhaka",
            zipCode: "1200"
        };
    }

    viewOrder(orderId) {
        window.location.href = `order-details.html?id=${orderId}`;
    }

    rateOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Redirect to product page for review
        if (order.items.length > 0) {
            window.location.href = `product.html?id=${order.items[0].id}&review=true`;
        }
    }

    cancelOrder(orderId) {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        const order = this.orders.find(o => o.id === orderId);
        if (order && order.status === 'pending') {
            order.status = 'cancelled';
            localStorage.setItem('nur_orders', JSON.stringify(this.orders));
            this.loadOrders();
            this.showToast('Order cancelled successfully');
        }
    }

    trackOrder() {
        const trackInput = document.querySelector('.track-order-input');
        if (!trackInput) return;

        const orderId = trackInput.value.trim();
        if (!orderId) {
            this.showToast('Please enter order ID', 'warning');
            return;
        }

        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            window.location.href = `order-details.html?id=${orderId}`;
        } else {
            this.showToast('Order not found', 'error');
        }
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
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

// Initialize order management
const nurOrder = new NUROrder();
