// Dashboard-specific functionality

// Configuration: Set to true to use API, false to use mock data
const USE_API = true;  // Change to false to test with mock data

// Mock data for fallback/testing
const mockData = {
    totalChildren: 25,
    presentToday: 22,
    absentToday: 3,
    attendanceRate: 88,
    weeklyData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        present: [24, 23, 25, 22, 24, 20, 18],
        absent: [1, 2, 0, 3, 1, 5, 7]
    },
    monthlyData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        attendance: [92, 88, 85, 88]
    },
    recentActivity: [
        { name: 'Rahul Kumar', time: '08:15 AM', status: 'present', avatar: 'R' },
        { name: 'Priya Sharma', time: '08:20 AM', status: 'present', avatar: 'P' },
        { name: 'Amit Patel', time: '08:25 AM', status: 'present', avatar: 'A' },
        { name: 'Sneha Reddy', time: '08:30 AM', status: 'present', avatar: 'S' },
        { name: 'Vikram Singh', time: '08:35 AM', status: 'late', avatar: 'V' }
    ]
};

let weeklyChart = null;
let monthlyChart = null;

// Transform API data to match expected format (adjust based on vendor's response format)
function transformApiData(apiData) {
    // TODO: Adjust this transformation based on your vendor's API response structure
    // This is a sample transformation - you'll need to modify it based on actual API response
    
    return {
        totalChildren: apiData.totalChildren || apiData.total || 0,
        presentToday: apiData.presentToday || apiData.present || 0,
        absentToday: apiData.absentToday || apiData.absent || 0,
        attendanceRate: apiData.attendanceRate || apiData.rate || 0,
        weeklyData: apiData.weeklyData || mockData.weeklyData,
        monthlyData: apiData.monthlyData || mockData.monthlyData,
        recentActivity: apiData.recentActivity || apiData.recentCheckins || mockData.recentActivity
    };
}

// Fetch dashboard data from API
async function fetchDashboardData() {
    if (!USE_API) {
        return mockData;
    }
    
    try {
        // Fetch dashboard stats
        const statsResult = await ApiService.getDashboardStats();
        
        if (statsResult.success) {
            const apiData = statsResult.data;
            
            // If API returns all data in one response
            if (apiData.totalChildren !== undefined) {
                return transformApiData(apiData);
            }
            
            // Otherwise, fetch additional data
            const recentResult = await ApiService.getRecentActivity(5);
            
            // Fetch weekly data (you may need to calculate from attendance records)
            const today = new Date();
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            
            const weeklyResult = await ApiService.getAttendanceRange(
                weekAgo.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );
            
            // Combine and transform the data
            return transformApiData({
                ...apiData,
                recentActivity: recentResult.success ? recentResult.data : [],
                weeklyData: weeklyResult.success ? processWeeklyData(weeklyResult.data) : mockData.weeklyData
            });
        } else {
            console.warn('API request failed, using mock data:', statsResult.error);
            return mockData;
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return mockData;
    }
}

// Process weekly attendance data from API response
function processWeeklyData(attendanceRecords) {
    // TODO: Adjust this based on your vendor's API response format
    // This processes raw attendance records into weekly summary
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const present = [0, 0, 0, 0, 0, 0, 0];
    const absent = [0, 0, 0, 0, 0, 0, 0];
    
    // Process attendance records and group by day
    // This is a placeholder - adjust based on actual API response structure
    if (Array.isArray(attendanceRecords)) {
        attendanceRecords.forEach(record => {
            const date = new Date(record.date || record.timestamp);
            const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert to Mon-Sun
            
            if (record.status === 'present' || record.status === 'checkin') {
                present[dayIndex]++;
            } else {
                absent[dayIndex]++;
            }
        });
    }
    
    return { labels: days, present, absent };
}

// Initialize dashboard
async function initDashboard() {
    // Show loading state
    showLoadingState();
    
    const data = await fetchDashboardData();
    updateStats(data);
    initWeeklyChart(data);
    initMonthlyChart(data);
    updateRecentActivity(data);
    
    // Hide loading state
    hideLoadingState();
}

// Show loading indicator
function showLoadingState() {
    // You can add a loading spinner here if needed
    const stats = document.querySelectorAll('.stat-content h3');
    stats.forEach(stat => {
        if (stat.textContent.trim() === '') {
            stat.textContent = '...';
        }
    });
}

// Hide loading indicator
function hideLoadingState() {
    // Remove loading state if needed
}

// Update statistics
function updateStats(data) {
    document.getElementById('totalChildren').textContent = data.totalChildren || 0;
    document.getElementById('presentToday').textContent = data.presentToday || 0;
    document.getElementById('absentToday').textContent = data.absentToday || 0;
    document.getElementById('attendanceRate').textContent = (data.attendanceRate || 0) + '%';
}

// Initialize weekly attendance chart
function initWeeklyChart(data) {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    const weeklyData = data.weeklyData || mockData.weeklyData;
    
    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeklyData.labels,
            datasets: [
                {
                    label: 'Present',
                    data: weeklyData.present,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Absent',
                    data: weeklyData.absent,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });
}

// Initialize monthly overview chart
function initMonthlyChart(data) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    const monthlyData = data.monthlyData || mockData.monthlyData;
    
    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Attendance %',
                data: monthlyData.attendance,
                backgroundColor: '#4F46E5',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Attendance: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Update recent activity list
function updateRecentActivity(data) {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;
    
    const activities = data.recentActivity || [];
    
    if (activities.length === 0) {
        activityList.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--gray-500);">No recent activity</div>';
        return;
    }
    
    activityList.innerHTML = activities.map(activity => {
        // Handle different API response formats
        const name = activity.name || activity.childName || activity.studentName || 'Unknown';
        const time = activity.time || activity.checkInTime || activity.timestamp || '';
        const status = activity.status || 'present';
        const avatar = activity.avatar || name.charAt(0).toUpperCase();
        
        return `
            <div class="activity-item">
                <div class="activity-avatar">${avatar}</div>
                <div class="activity-info">
                    <h4>${name}</h4>
                    <p>Checked in at ${time}</p>
                </div>
                <div class="activity-status ${status}">
                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
            </div>
        `;
    }).join('');
}

// Refresh dashboard data
async function refreshDashboard() {
    await initDashboard();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    
    // Handle week selector
    const weekSelect = document.getElementById('weekSelect');
    if (weekSelect) {
        weekSelect.addEventListener('change', async function() {
            // Fetch data for selected week
            await refreshDashboard();
        });
    }
    
    // Auto-refresh if enabled
    if (USE_API && API_CONFIG && API_CONFIG.refreshInterval > 0) {
        setInterval(refreshDashboard, API_CONFIG.refreshInterval);
    }
});
