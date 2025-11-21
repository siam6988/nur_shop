// Basic Authentication Functions
function signUp(email, password, fullName) {
    alert('রেজিস্টার ফিচার শীঘ্রই আসছে!');
}

function signIn(email, password) {
    alert('লগইন ফিচার শীঘ্রই আসছে!');
}

function signInWithGoogle() {
    alert('Google লগইন শীঘ্রই আসছে!');
}

function signInWithFacebook() {
    alert('Facebook লগইন শীঘ্রই আসছে!');
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
            signUp(email, password, fullName);
        });
    }
});

// Export functions
window.signInWithGoogle = signInWithGoogle;
window.signInWithFacebook = signInWithFacebook;
