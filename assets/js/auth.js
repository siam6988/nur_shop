// Authentication Functions
function signUp(email, password, fullName) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Add user data to Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                fullName: fullName,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                points: 0,
                orders: 0
            });
        })
        .then(() => {
            showToast(translations[currentLanguage].registerSuccess);
            closeAuthModal();
            checkAuthState();
        })
        .catch((error) => {
            console.error('Sign up error:', error);
            showToast(error.message);
        });
}

function signIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showToast(translations[currentLanguage].loginSuccess);
            closeAuthModal();
            checkAuthState();
        })
        .catch((error) => {
            console.error('Sign in error:', error);
            showToast(error.message);
        });
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider)
        .then((result) => {
            // Check if user exists in Firestore
            const user = result.user;
            return db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (!doc.exists) {
                        // Create new user document
                        return db.collection('users').doc(user.uid).set({
                            fullName: user.displayName,
                            email: user.email,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            points: 0,
                            orders: 0
                        });
                    }
                });
        })
        .then(() => {
            showToast(translations[currentLanguage].loginSuccess);
            closeAuthModal();
            checkAuthState();
        })
        .catch((error) => {
            console.error('Google sign in error:', error);
            showToast(error.message);
        });
}

function signInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            return db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (!doc.exists) {
                        return db.collection('users').doc(user.uid).set({
                            fullName: user.displayName,
                            email: user.email,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            points: 0,
                            orders: 0
                        });
                    }
                });
        })
        .then(() => {
            showToast(translations[currentLanguage].loginSuccess);
            closeAuthModal();
            checkAuthState();
        })
        .catch((error) => {
            console.error('Facebook sign in error:', error);
            showToast(error.message);
        });
}

function signOut() {
    return auth.signOut()
        .then(() => {
            showToast(currentLanguage === 'bn' ? 'সফলভাবে লগআউট হয়েছে' : 'Successfully signed out');
            checkAuthState();
        })
        .catch((error) => {
            console.error('Sign out error:', error);
            showToast(error.message);
        });
}

// Form Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            signIn(email, password);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelectorAll('input[type="password"]')[0].value;
            const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;

            if (password !== confirmPassword) {
                showToast(currentLanguage === 'bn' ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match');
                return;
            }

            if (password.length < 6) {
                showToast(currentLanguage === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
                return;
            }

            signUp(email, password, fullName);
        });
    }
});

// Export functions for global use
window.signInWithGoogle = signInWithGoogle;
window.signInWithFacebook = signInWithFacebook;
window.signOut = signOut;
