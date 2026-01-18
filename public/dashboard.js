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
        // Fetch dashboard stats (total children, present today, etc.)
        const statsResult = await ApiService.getDashboardStats();
        
        // Fetch recent activity
        const recentResult = await ApiService.getRecentActivity(5);
        
        // Fetch weekly data (last 7 days)
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        
        const weeklyResult = await ApiService.getAttendanceRange(
            weekAgo.toISOString().split('T')[0],
            today.toISOString().split('T')[0]
        );
        
        // Fetch monthly data (current month)
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyResult = await ApiService.getAttendanceRange(
            firstDayOfMonth.toISOString().split('T')[0],
            today.toISOString().split('T')[0]
        );
        
        // Process the data
        const stats = statsResult.success ? statsResult.data : {};
        const weeklyData = weeklyResult.success ? processWeeklyData(weeklyResult.data) : mockData.weeklyData;
        const monthlyData = monthlyResult.success ? processMonthlyData(monthlyResult.data, stats.totalChildren || 0) : mockData.monthlyData;
        const recentActivity = recentResult.success ? recentResult.data : [];
        
        return {
            totalChildren: stats.totalChildren || 0,
            presentToday: stats.presentToday || 0,
            absentToday: stats.absentToday || 0,
            attendanceRate: stats.attendanceRate || 0,
            weeklyData: weeklyData,
            monthlyData: monthlyData,
            recentActivity: recentActivity
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return mockData;
    }
}

// Parse date from DD/MM/YYYY format
function parseDate(dateString) {
    if (!dateString) return null;
    
    // Handle DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    
    // Fallback to standard date parsing
    return new Date(dateString);
}

// Get day name from date
function getDayName(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

// Process weekly attendance data from API response
function processWeeklyData(attendanceRecords) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const present = [0, 0, 0, 0, 0, 0, 0];
    const absent = [0, 0, 0, 0, 0, 0, 0];
    
    // Group records by date and employee (to count unique employees per day)
    const dailyAttendance = new Map(); // Key: date string, Value: Set of employee codes
    
    if (Array.isArray(attendanceRecords)) {
        attendanceRecords.forEach(record => {
            const dateStr = record.date || '';
            if (!dateStr) return;
            
            const date = parseDate(dateStr);
            if (!date || isNaN(date.getTime())) return;
            
            // Get date key (YYYY-MM-DD format for consistency)
            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            
            if (!dailyAttendance.has(dateKey)) {
                dailyAttendance.set(dateKey, {
                    date: date,
                    present: new Set(),
                    absent: new Set()
                });
            }
            
            const dayData = dailyAttendance.get(dateKey);
            const empCode = record.id || '';
            const status = (record.status || '').toLowerCase();
            
            if (status === 'present' || status === 'p') {
                dayData.present.add(empCode);
            } else if (status === 'absent' || status === 'a') {
                dayData.absent.add(empCode);
            }
        });
    }
    
    // Get last 7 days
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        last7Days.push(date);
    }
    
    // Count attendance for each of the last 7 days
    last7Days.forEach((date, index) => {
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayData = dailyAttendance.get(dateKey);
        
        if (dayData) {
            present[index] = dayData.present.size;
            absent[index] = dayData.absent.size;
        }
    });
    
    // Update labels to show actual dates
    const labels = last7Days.map(date => {
        const dayName = getDayName(date);
        const day = date.getDate();
        return `${dayName} ${day}`;
    });
    
    return { labels, present, absent };
}

// Process monthly attendance data to calculate weekly percentages
function processMonthlyData(attendanceRecords, totalChildren) {
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
        return mockData.monthlyData;
    }
    
    // Group records by week
    const weeklyData = new Map();
    
    attendanceRecords.forEach(record => {
        const dateStr = record.date || '';
        if (!dateStr) return;
        
        const date = parseDate(dateStr);
        if (!date || isNaN(date.getTime())) return;
        
        // Get week number (week of month: 1-4 or 1-5)
        const weekOfMonth = Math.ceil(date.getDate() / 7);
        const weekKey = `Week ${weekOfMonth}`;
        
        if (!weeklyData.has(weekKey)) {
            weeklyData.set(weekKey, {
                present: new Set(),
                absent: new Set()
            });
        }
        
        const weekData = weeklyData.get(weekKey);
        const empCode = record.id || '';
        const status = (record.status || '').toLowerCase();
        
        if (status === 'present' || status === 'p') {
            weekData.present.add(empCode);
        } else if (status === 'absent' || status === 'a') {
            weekData.absent.add(empCode);
        }
    });
    
    // Calculate attendance percentage for each week
    const labels = [];
    const attendance = [];
    
    // Get current month's weeks
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const weeksInMonth = Math.ceil(daysInMonth / 7);
    
    for (let week = 1; week <= weeksInMonth; week++) {
        const weekKey = `Week ${week}`;
        const weekData = weeklyData.get(weekKey);
        
        labels.push(weekKey);
        
        if (weekData && totalChildren > 0) {
            // Calculate percentage: (unique employees who attended at least once / total children) * 100
            const uniqueAttendees = weekData.present.size;
            const attendancePercent = Math.round((uniqueAttendees / totalChildren) * 100);
            attendance.push(attendancePercent);
        } else {
            attendance.push(0);
        }
    }
    
    return { labels, attendance };
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
    // Student stats
    document.getElementById('totalStudents').textContent = data.totalStudents || 0;
    document.getElementById('presentStudents').textContent = data.presentStudents || 0;
    document.getElementById('absentStudents').textContent = data.absentStudents || 0;
    document.getElementById('attendanceRate').textContent = (data.attendanceRate || 0) + '%';
    
    // Staff stats
    document.getElementById('totalStaff').textContent = data.totalStaff || 0;
    document.getElementById('presentStaff').textContent = data.presentStaff || 0;
    document.getElementById('absentStaff').textContent = data.absentStaff || 0;
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
