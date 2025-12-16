// Firebase Configuration for NUR Shopping
const firebaseConfig = {
    apiKey: "AIzaSyDSYALT_jaIQrTq-oZP9sMyUJWXaLSjTY4",
    authDomain: "nur-shop-siam.firebaseapp.com",
    projectId: "nur-shop-siam",
    storageBucket: "nur-shop-siam.firebasestorage.app",
    messagingSenderId: "536596371721",
    appId: "1:536596371721:web:454f879521237e61211bd8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Initialize Firestore settings
db.settings({
    timestampsInSnapshots: true
});

// Authentication providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();

// Export Firebase services
window.firebase = firebase;
window.auth = auth;
window.db = db;
window.storage = storage;
window.googleProvider = googleProvider;
window.facebookProvider = facebookProvider;

console.log('Firebase initialized successfully');
