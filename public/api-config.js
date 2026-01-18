// API Configuration for Backend Server
// ============================================
// This file connects to your backend server (not directly to E-Time Office Cloud)
// Your backend server handles authentication with E-Time Office Cloud
// ============================================

const API_CONFIG = {
    // Backend server URL (where your Node.js server is running)
    baseURL: 'https://praja-kirana-seva-attendance-system.onrender.com/api',  // Change this to your backend server URL
    
    // API Endpoints (these call your backend, which then calls E-Time Office Cloud)
    endpoints: {
        // Get today's attendance
        todayAttendance: '/attendance/today',
        // Get attendance for a date range
        attendanceRange: '/attendance/range',
        // Get all children/employees list
        childrenList: '/children',
        // Get specific child's attendance
        childAttendance: '/attendance/employee',
        // Get dashboard statistics
        dashboardStats: '/dashboard/stats',
        // Get recent check-ins
        recentActivity: '/attendance/recent',
        // Add custom endpoints here
        // customEndpoint: '/your/custom/endpoint'
    },
    
    // Request headers
    headers: {
        'Content-Type': 'application/json'
    },
    
    // Polling interval for real-time updates (in milliseconds)
    // Set to 0 to disable auto-refresh
    refreshInterval: 30000  // 30 seconds
};

// Helper function to build API URL
function getApiUrl(endpoint) {
    return API_CONFIG.baseURL + endpoint;
}

// Helper function to get request headers (includes JWT token if available)
function getApiHeaders() {
    const token = sessionStorage.getItem('authToken');
    const headers = { ...API_CONFIG.headers };
    
    // Add Authorization header with JWT token if available
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// Make API request with error handling
async function apiRequest(endpoint, options = {}) {
    try {
        const url = getApiUrl(endpoint);
        const headers = getApiHeaders();
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {})
            }
        });
        
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401 || response.status === 403) {
            // Clear token and redirect to login
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('userName');
            if (window.location.pathname.split('/').pop() !== 'index.html') {
                window.location.href = 'index.html';
            }
            throw new Error('Session expired. Please login again.');
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data; // Backend returns { success: true, data: ... }
    } catch (error) {
        console.error('API Request Failed:', error);
        return { success: false, error: error.message };
    }
}

// API Functions
const ApiService = {
    // Get today's attendance
    async getTodayAttendance() {
        return await apiRequest(API_CONFIG.endpoints.todayAttendance);
    },
    
    // Get attendance for date range
    async getAttendanceRange(startDate, endDate) {
        const params = new URLSearchParams({
            start: startDate,
            end: endDate
        });
        return await apiRequest(`${API_CONFIG.endpoints.attendanceRange}?${params}`);
    },
    
    // Get all children list
    async getChildrenList() {
        return await apiRequest(API_CONFIG.endpoints.childrenList);
    },
    
    // Get specific child's attendance
    async getChildAttendance(childId, date = null) {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return await apiRequest(`${API_CONFIG.endpoints.childAttendance}/${childId}${queryString}`);
    },
    
    // Get dashboard statistics
    async getDashboardStats() {
        return await apiRequest(API_CONFIG.endpoints.dashboardStats);
    },
    
    // Get recent activity/check-ins
    async getRecentActivity(limit = 10) {
        return await apiRequest(`${API_CONFIG.endpoints.recentActivity}?limit=${limit}`);
    },

    // Add custom API functions here
    // async customFunction(param) {
    //     return await apiRequest(`${API_CONFIG.endpoints.customEndpoint}?param=${param}`);
    // }
};
