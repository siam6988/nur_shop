// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSYALT_jaIQrTq-oZP9sMyUJWXaLSjTY4",
  authDomain: "nur-shop-siam.firebaseapp.com",
  projectId: "nur-shop-siam",
  storageBucket: "nur-shop-siam.firebasestorage.app",
  messagingSenderId: "536596371721",
  appId: "1:536596371721:web:454f879521237e61211bd8"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Firebase Services
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Export Firebase services
window.firebaseDB = db;
window.firebaseStorage = storage;
window.firebaseAuth = auth;
