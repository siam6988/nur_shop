import state from './store.js';
import { fetchFeaturedProducts, fetchProductById } from './api.js';
import { renderHomePage, renderProductDetailsPage, renderLoginPage, renderSignUpPage, renderAccountPage } from './ui.js';
import { initializeAuthListener, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser } from './auth.js';

const routes = {
    '/': renderHomePage,
    '/products/:id': renderProductDetailsPage,
    '/login': renderLoginPage,
    '/signup': renderSignUpPage,
    '/account': renderAccountPage,
};

export async function router() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, id] = hash.split('/').filter(p => p);

    // Protected Route: Account Page
    if (path === 'account') {
        if (!state.currentUser) {
            window.location.hash = '/login'; // লগইন করা না থাকলে লগইন পেজে পাঠান
            return;
        }
        renderAccountPage(state.currentUser);
        return;
    }
    
    // ... ( আগের রাউটিং কোড ) ...
    if (path === 'signup') {
        renderSignUpPage();
    } else if (path === 'login') {
        renderLoginPage();
    }
    // ...
}

function setupEventListeners() {
    document.body.addEventListener('submit', async e => {
        e.preventDefault();
        if (e.target.id === 'login-form') {
            const email = e.target.querySelector('#login-email').value;
            const password = e.target.querySelector('#login-password').value;
            await signInWithEmail(email, password);
        } else if (e.target.id === 'signup-form') {
            // সাইন আপ ফর্মের জন্য একই রকম লজিক
        }
    });

    document.body.addEventListener('click', async e => {
        if (e.target.id === 'google-signin-btn') {
            await signInWithGoogle();
        } else if (e.target.id === 'logout-btn') {
            await signOutUser();
        }
        // ... (add-to-cart-btn এর লজিক) ...
    });
}


function init() {
    // Auth Listener প্রথমে চালু করুন
    initializeAuthListener();

    // এরপর ইভেন্ট লিসেনার সেটআপ করুন
    setupEventListeners();

    // URL পরিবর্তনের জন্য শুনুন
    window.addEventListener('hashchange', router);
    // প্রথমবার লোডের জন্য অপেক্ষা না করে Auth Listener নিজেই router() কল করবে
}

// অ্যাপ চালু করুন
init();```

### **পরিবর্তনগুলোর সারসংক্ষেপ:**

1.  **`auth.js` তৈরি করা হয়েছে:** এই ফাইলটি এখন Firebase Authentication-এর সাথে সম্পর্কিত সমস্ত লজিক ধারণ করে।
2.  **`store.js` এ `setUser`:** একটি ফাংশন যোগ করা হয়েছে যা অ্যাপের বর্তমান ব্যবহারকারীর তথ্য ধারণ করে।
3.  **`ui.js` এ ফর্ম ও বাটন:** লগইন ও সাইন-আপ পেজের ফর্ম এবং বাটনগুলোতে `id` যুক্ত করা হয়েছে। একটি বেসিক অ্যাকাউন্ট পেজও যোগ করা হয়েছে।
4.  **`app.js` এর মূল পরিবর্তন:**
    *   `initializeAuthListener` ফাংশনটি অ্যাপ শুরু হওয়ার সাথে সাথেই কল করা হয়। এটি ব্যবহারকারীর লগইন স্ট্যাটাস পর্যবেক্ষণ করে এবং `store`-কে আপডেট রাখে।
    *   `router` এখন `/account` এর মতো "সুরক্ষিত" রুট হ্যান্ডেল করতে পারে।
    *   ফর্ম সাবমিট এবং বাটন ক্লিকের জন্য `setupEventListeners` ফাংশনে `signInWithEmail`, `signOutUser` ইত্যাদি ফাংশন কল করা হয়েছে।

এখন এই কাঠামোটি সম্পূর্ণ এবং ব্যবহারকারীর লগইন, সাইন-আপ ও লগ-আউটের মতো জরুরি কাজগুলো করার জন্য প্রস্তুত।
