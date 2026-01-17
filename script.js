// Authentication and Shared Functions
// Now uses backend authentication with JWT tokens

// Default Credentials (stored on backend):
//   Username: admin  | Password: admin123
//   Username: staff  | Password: staff123

// API Configuration
// Use the same backend URL as api-config.js
const API_BASE_URL = 'https://praja-kirana-seva-attendance-system.onrender.com/api';

// Check if user is logged in (verifies token with backend)
async function checkAuth() {
    const token = sessionStorage.getItem('authToken');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If on login page and has token, verify it
    if (token && currentPage === 'index.html') {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                // Token is valid, redirect to dashboard
                window.location.href = 'dashboard.html';
                return;
            } else {
                // Token invalid, clear it
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('userName');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            // Clear invalid token
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('userName');
        }
    }
    
    // If not on login page and no token, redirect to login
    if (!token && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
        return;
    }
    
    // If on login page and no token, stay on login page
    if (!token && (currentPage === 'index.html' || currentPage === '')) {
        return;
    }
}

// Login function (authenticates with backend)
async function handleLogin(event) {
    if (event) {
        event.preventDefault();
    }
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    const loginButton = document.querySelector('#loginForm button[type="submit"]');
    
    // Clear previous errors
    errorDiv.classList.remove('show');
    
    // Validate inputs
    if (!username || !password) {
        errorDiv.textContent = 'Please enter both username and password';
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 3000);
        return;
    }
    
    // Disable login button during request
    if (loginButton) {
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
    }
    
    try {
        // Call backend login endpoint
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Store token and user info
            sessionStorage.setItem('authToken', data.data.token);
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', data.data.user.username);
            sessionStorage.setItem('userName', data.data.user.name);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error message
            errorDiv.textContent = data.error || 'Invalid username or password';
            errorDiv.classList.add('show');
            setTimeout(() => {
                errorDiv.classList.remove('show');
            }, 5000);
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Connection error. Please check if the backend server is running.';
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    } finally {
        // Re-enable login button
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    }
}

// Logout function
function logout() {
    // Clear all session data including token
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Get current user name
function getCurrentUserName() {
    return sessionStorage.getItem('userName') || 'User';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    await checkAuth();
    
    // Set user name in header if available
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        if (el) {
            el.textContent = getCurrentUserName();
        }
    });
    
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Make logout available globally
window.logout = logout;
