import state from './store.js';
import { fetchFeaturedProducts, fetchProductById } from './api.js';
import { renderHomePage, renderProductDetailsPage, renderLoginPage } from './ui.js';

const routes = {
    '/': renderHomePage,
    '/products/:id': renderProductDetailsPage,
    '/login': renderLoginPage,
};

async function router() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, id] = hash.split('/').filter(p => p);
    
    if (path === 'products' && id) {
        const product = await fetchProductById(id);
        renderProductDetailsPage(product);
    } else if (path === '') {
        const products = await fetchFeaturedProducts();
        renderHomePage(products);
    } else if (path === 'login') {
        renderLoginPage();
    }
    // Add more routes for cart, signup, account etc.
}

// Listen for URL hash changes
window.addEventListener('hashchange', router);
// Load the initial page
window.addEventListener('load', router);

// Event Delegation for handling clicks
document.addEventListener('click', e => {
    if (e.target.matches('.add-to-cart-btn')) {
        const productId = e.target.dataset.id;
        // Logic to add product to cart will go here
        console.log(`Product ${productId} added to cart!`);
        // You would call a function from store.js here
        // e.g., addToCart(product)
    }
});
