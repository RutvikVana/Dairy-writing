// Authentication JavaScript
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('diaryUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.initializeElements();
        this.bindEvents();
        this.checkAuthStatus();
    }

    initializeElements() {
        // Common elements
        this.toastContainer = document.getElementById('toastContainer');
        
        // Login form elements
        this.loginForm = document.getElementById('loginForm');
        this.loginEmail = document.getElementById('email');
        this.loginPassword = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.rememberMe = document.getElementById('rememberMe');
        
        // Signup form elements
        this.signupForm = document.getElementById('signupForm');
        this.firstName = document.getElementById('firstName');
        this.lastName = document.getElementById('lastName');
        this.signupEmail = document.getElementById('email');
        this.signupPassword = document.getElementById('password');
        this.confirmPassword = document.getElementById('confirmPassword');
        this.username = document.getElementById('username');
        this.termsAccepted = document.getElementById('termsAccepted');
        this.newsletter = document.getElementById('newsletter');
        this.confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        
        // Password strength elements
        this.passwordStrength = document.getElementById('passwordStrength');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
    }

    bindEvents() {
        // Login form events
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Signup form events
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        // Password toggle events
        if (this.passwordToggle) {
            this.passwordToggle.addEventListener('click', () => this.togglePassword('password'));
        }
        
        if (this.confirmPasswordToggle) {
            this.confirmPasswordToggle.addEventListener('click', () => this.togglePassword('confirmPassword'));
        }
        
        // Password strength check
        if (this.signupPassword) {
            this.signupPassword.addEventListener('input', () => this.checkPasswordStrength());
        }
        
        // Social auth buttons
        document.querySelectorAll('.social-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleSocialAuth(e));
        });
    }

    checkAuthStatus() {
        // If user is already logged in and on auth pages, redirect to diary
        if (this.currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
            window.location.href = 'index.html';
        }
        
        // If user is not logged in and on diary page, redirect to login
        if (!this.currentUser && window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = this.loginEmail.value.trim();
        const password = this.loginPassword.value;
        const rememberMe = this.rememberMe.checked;
        
        // Validation
        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }
        
        // Find user
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            this.showToast('User not found. Please check your email or sign up', 'error');
            return;
        }
        
        // Check password
        if (!this.verifyPassword(password, user.password)) {
            this.showToast('Incorrect password. Please try again', 'error');
            return;
        }
        
        // Login successful
        this.currentUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        this.showToast('Login successful! Redirecting...', 'success');
        
        // Redirect to diary after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    handleSignup(e) {
        e.preventDefault();
        
        const firstName = this.firstName.value.trim();
        const lastName = this.lastName.value.trim();
        const email = this.signupEmail.value.trim();
        const password = this.signupPassword.value;
        const confirmPassword = this.confirmPassword.value;
        const username = this.username.value.trim();
        const termsAccepted = this.termsAccepted.checked;
        const newsletter = this.newsletter.checked;
        
        // Validation
        if (!firstName || !lastName) {
            this.showToast('Please enter your first and last name', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }
        
        if (!termsAccepted) {
            this.showToast('Please accept the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        // Check if user already exists
        if (this.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            this.showToast('An account with this email already exists', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            password: this.hashPassword(password),
            username: username || null,
            newsletter,
            createdAt: new Date().toISOString(),
            diaryEntries: []
        };
        
        // Add user to users array
        this.users.push(newUser);
        localStorage.setItem('diaryUsers', JSON.stringify(this.users));
        
        // Auto login
        this.currentUser = {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.showToast('Account created successfully! Welcome to My Diary!', 'success');
        
        // Redirect to diary after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    handleSocialAuth(e) {
        e.preventDefault();
        const provider = e.currentTarget.classList.contains('google') ? 'Google' : 'Facebook';
        this.showToast(`${provider} authentication is not implemented yet. Please use email signup.`, 'error');
    }

    togglePassword(fieldId) {
        const field = document.getElementById(fieldId);
        const toggle = document.getElementById(fieldId === 'password' ? 'passwordToggle' : 'confirmPasswordToggle');
        
        if (field.type === 'password') {
            field.type = 'text';
            toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            field.type = 'password';
            toggle.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    checkPasswordStrength() {
        const password = this.signupPassword.value;
        let strength = 0;
        let strengthText = 'Password strength';
        
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Reset classes
        this.strengthFill.className = 'strength-fill';
        
        if (strength <= 2) {
            this.strengthFill.classList.add('weak');
            strengthText = 'Weak password';
        } else if (strength <= 4) {
            this.strengthFill.classList.add('medium');
            strengthText = 'Medium strength password';
        } else {
            this.strengthFill.classList.add('strong');
            strengthText = 'Strong password';
        }
        
        this.strengthText.textContent = strengthText;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    hashPassword(password) {
        // Simple hash function (in production, use bcrypt or similar)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-info-circle';
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    // Static methods for use in other files
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    static logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');
        window.location.href = 'login.html';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('currentUser');
    }

    static getUserEntries(userId) {
        const users = JSON.parse(localStorage.getItem('diaryUsers')) || [];
        const user = users.find(u => u.id === userId);
        return user ? user.diaryEntries : [];
    }

    static saveUserEntries(userId, entries) {
        const users = JSON.parse(localStorage.getItem('diaryUsers')) || [];
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].diaryEntries = entries;
            localStorage.setItem('diaryUsers', JSON.stringify(users));
        }
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
    
    // Make auth manager globally accessible
    window.authManager = authManager;
    
    // Add some sample users for testing
    if (authManager.users.length === 0) {
        const sampleUsers = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: authManager.hashPassword('password123'),
                username: 'johndoe',
                newsletter: true,
                createdAt: new Date().toISOString(),
                diaryEntries: [
                    {
                        id: Date.now() - 2,
                        title: "Welcome to My Diary",
                        content: "This is my first diary entry. I'm excited to start this journey of self-reflection and personal growth.",
                        date: new Date().toISOString().split('T')[0],
                        mood: "😊",
                        timestamp: new Date(Date.now() - 2).toISOString(),
                        wordCount: 20
                    }
                ]
            },
            {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                password: authManager.hashPassword('password123'),
                username: 'janesmith',
                newsletter: false,
                createdAt: new Date().toISOString(),
                diaryEntries: [
                    {
                        id: Date.now() - 1,
                        title: "Getting Started",
                        content: "Today I decided to start keeping a digital diary. I hope this will help me track my thoughts and emotions better.",
                        date: new Date().toISOString().split('T')[0],
                        mood: "🤔",
                        timestamp: new Date(Date.now() - 1).toISOString(),
                        wordCount: 25
                    }
                ]
            }
        ];
        
        authManager.users = sampleUsers;
        localStorage.setItem('diaryUsers', JSON.stringify(sampleUsers));
    }
});

// Add logout functionality to diary page
if (window.location.pathname.includes('index.html')) {
    // Add logout button to header if user is authenticated
    const addLogoutButton = () => {
        const headerActions = document.querySelector('.header-actions');
        if (headerActions && AuthManager.isAuthenticated()) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-outline';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    AuthManager.logout();
                }
            });
            headerActions.appendChild(logoutBtn);
        }
    };
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addLogoutButton);
    } else {
        addLogoutButton();
    }
} 