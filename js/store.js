// The central state of our application
const state = {
    currentUser: null,
    products: [],
    cart: JSON.parse(localStorage.getItem('nurCart')) || [],
    currentProduct: null,
    // Add other states like categories, orders etc.
};

// Functions to update the state (mutations)
export function setUser(user) {
    state.currentUser = user;
}

export function setProducts(products) {
    state.products = products;
}

export function addToCart(product) {
    // Check if product already in cart, if so, increment quantity
    state.cart.push({ ...product, quantity: 1 });
    localStorage.setItem('nurCart', JSON.stringify(state.cart));
}

// You can add more functions like removeFromCart, updateQuantity etc.

// Export the state so other modules can read it
export default state;```

---

#### **`js/api.js` (Data Fetching Layer)**

এই ফাইলটি Firestore থেকে ডেটা আনা-নেওয়ার কাজ করবে। Firebase কানেক্ট না থাকলেও ডেমো ডেটা দিয়ে কাজ করবে।

```javascript
import { db } from './services/firebase.js';
import { collection, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const DEMO_PRODUCTS = [
    { id: 'demo1', title_bn: 'প্রিমিয়াম কটন টি-শার্ট', price: 750, images: ['assets/images/placeholder.png'], featured: true },
    { id: 'demo2', title_bn: 'আরামদায়ক ডেনিম প্যান্ট', price: 1800, images: ['assets/images/placeholder.png'], featured: true },
];

export async function fetchFeaturedProducts() {
    try {
        const q = query(collection(db, 'products'), where('featured', '==', true));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return DEMO_PRODUCTS; // Fallback to demo
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn("Firebase is not connected. Using demo data.", error.message);
        return DEMO_PRODUCTS;
    }
}

export async function fetchProductById(id) {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return DEMO_PRODUCTS.find(p => p.id === id) || null;
        }
    } catch (error) {
        return DEMO_PRODUCTS.find(p => p.id === id) || null;
    }
}
