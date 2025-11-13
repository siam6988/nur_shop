import { auth } from './services/firebase.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { setUser } from './store.js';
import { router } from './app.js'; // রাউটার ইম্পোর্ট করা হলো

// Google Provider ইনিশিয়ালাইজ করা
const googleProvider = new GoogleAuthProvider();

/**
 * ইমেইল এবং পাসওয়ার্ড দিয়ে নতুন অ্যাকাউন্ট তৈরি করে।
 * @param {string} email
 * @param {string} password
 */
export async function signUpWithEmail(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Signed up successfully:', userCredential.user);
        return userCredential.user;
    } catch (error) {
        alert(getAuthErrorMessage(error)); // ব্যবহারকারীকে এরর দেখানো
        console.error('Sign up error:', error);
    }
}

/**
 * ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করে।
 * @param {string} email
 * @param {string} password
 */
export async function signInWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Signed in successfully:', userCredential.user);
        return userCredential.user;
    } catch (error) {
        alert(getAuthErrorMessage(error));
        console.error('Sign in error:', error);
    }
}

/**
 * গুগল অ্যাকাউন্ট ব্যবহার করে সাইন-ইন করে।
 */
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Signed in with Google:', result.user);
        return result.user;
    } catch (error) {
        alert(getAuthErrorMessage(error));
        console.error('Google sign in error:', error);
    }
}

/**
 * ব্যবহারকারীকে লগ-আউট করে।
 */
export async function signOutUser() {
    try {
        await signOut(auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

/**
 * ব্যবহারকারীর লগইন অবস্থার পরিবর্তন পর্যবেক্ষণ করে।
 */
export function initializeAuthListener() {
    onAuthStateChanged(auth, (user) => {
        setUser(user); // store.js এ ব্যবহারকারীর তথ্য আপডেট করা
        
        // লগইন বা লগ-আউট হলে অ্যাপটি রি-রাউট করা হয়
        // এটি নিশ্চিত করে যে ব্যবহারকারী লগইন করার পর হোম পেজে চলে যায়
        const currentHash = window.location.hash.slice(1);
        if (user && (currentHash === '/login' || currentHash === '/signup')) {
            window.location.hash = '/'; // লগইন হলে হোমপেজে রিডাইরেক্ট
        } else {
            router(); // পেজটি রি-রেন্ডার করা
        }
    });
}

/**
 * Firebase থেকে পাওয়া এরর কোডকে বাংলা মেসেজে রূপান্তর করে।
 * @param {Error} error 
 */
function getAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'আপনার ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।';
        case 'auth/invalid-email':
            return 'দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন।';
        case 'auth/weak-password':
            return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
        default:
            return 'একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    }
}
