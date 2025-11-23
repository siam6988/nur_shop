// Authentication Management
class NURAuth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('nur_user')) || null;
        this.init();
    }

    init() {
        this.setupAuthForms();
        this.checkAuthState();
    }

    setupAuthForms() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Social login buttons
        document.querySelectorAll('.social-login-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = btn.dataset.provider;
                this.handleSocialLogin(provider);
            });
        });
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('remember-me').checked;

        try {
            // Simulate API call
            await this.simulateAPICall();
            
            const users = JSON.parse(localStorage.getItem('nur_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                this.currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    points: user.points || 0
                };

                localStorage.setItem('nur_user', JSON.stringify(this.currentUser));
                
                if (remember) {
                    localStorage.setItem('nur_remember', 'true');
                }

                this.showToast('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                this.showToast('Invalid email or password', 'error');
            }
        } catch (error) {
            this.showToast('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('accept-terms').checked;

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        if (!terms) {
            this.showToast('Please accept terms and conditions', 'warning');
            return;
        }

        try {
            // Simulate API call
            await this.simulateAPICall();

            const users = JSON.parse(localStorage.getItem('nur_users')) || [];
            
            if (users.find(u => u.email === email)) {
                this.showToast('Email already registered', 'error');
                return;
            }

            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                points: 100, // Welcome bonus points
                joined: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('nur_users', JSON.stringify(users));

            this.currentUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                points: newUser.points
            };

            localStorage.setItem('nur_user', JSON.stringify(this.currentUser));
            
            this.showToast('Registration successful! Welcome to NUR!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            this.showToast('Registration failed. Please try again.', 'error');
        }
    }

    handleSocialLogin(provider) {
        // Simulate social login
        this.showToast(`Connecting with ${provider}...`, 'info');
        
        setTimeout(() => {
            this.currentUser = {
                id: Date.now(),
                name: `User${Date.now()}`,
                email: `user${Date.now()}@${provider}.com`,
                points: 100,
                provider: provider
            };

            localStorage.setItem('nur_user', JSON.stringify(this.currentUser));
            this.showToast(`Logged in with ${provider}`, 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 2000);
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('nur_user');
        this.showToast('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    checkAuthState() {
        if (this.currentUser && window.location.pathname.includes('auth.html')) {
            window.location.href = 'profile.html';
        }

        if (!this.currentUser && window.location.pathname.includes('profile.html')) {
            window.location.href = 'auth.html';
        }

        // Update UI based on auth state
        this.updateAuthUI();
    }

    updateAuthUI() {
        if (this.currentUser) {
            const authElements = document.querySelectorAll('.auth-required');
            authElements.forEach(el => {
                el.style.display = 'block';
            });

            const guestElements = document.querySelectorAll('.guest-only');
            guestElements.forEach(el => {
                el.style.display = 'none';
            });

            // Update user info in profile
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            const userPoints = document.getElementById('user-points');

            if (userName) userName.textContent = this.currentUser.name;
            if (userEmail) userEmail.textContent = this.currentUser.email;
            if (userPoints) userPoints.textContent = this.currentUser.points;
        }
    }

    async simulateAPICall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    showToast(message, type = 'success') {
        // Reuse the toast functionality from main app
        if (window.nurApp) {
            window.nurApp.showToast(message, type);
        } else {
            // Fallback toast implementation
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                z-index: 10000;
            `;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }
}

// Initialize auth
const nurAuth = new NURAuth();
