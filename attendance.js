// Attendance page functionality

// Configuration: Set to true to use API, false to use mock data
const USE_API = true;  // Using real API data now

// Mock data for fallback/testing (keeping first 25 entries)
const mockChildrenData = [
    { id: 'CH001', name: 'Rahul Kumar', age: 12, grade: '6th', photo: 'R', checkIn: '08:15 AM', checkOut: '04:30 PM', status: 'present', attendanceDays: 22, totalDays: 25 },
    { id: 'CH002', name: 'Priya Sharma', age: 10, grade: '5th', photo: 'P', checkIn: '08:20 AM', checkOut: '04:25 PM', status: 'present', attendanceDays: 24, totalDays: 25 },
    { id: 'CH003', name: 'Amit Patel', age: 11, grade: '6th', photo: 'A', checkIn: '08:25 AM', checkOut: '04:40 PM', status: 'present', attendanceDays: 23, totalDays: 25 },
    { id: 'CH004', name: 'Sneha Reddy', age: 9, grade: '4th', photo: 'S', checkIn: '08:30 AM', checkOut: '04:20 PM', status: 'present', attendanceDays: 25, totalDays: 25 },
    { id: 'CH005', name: 'Vikram Singh', age: 13, grade: '7th', photo: 'V', checkIn: '09:00 AM', checkOut: '04:35 PM', status: 'late', attendanceDays: 20, totalDays: 25 },
    { id: 'CH006', name: 'Kavya Nair', age: 8, grade: '3rd', photo: 'K', checkIn: '08:18 AM', checkOut: '04:15 PM', status: 'present', attendanceDays: 24, totalDays: 25 },
    { id: 'CH007', name: 'Arjun Mehta', age: 14, grade: '8th', photo: 'A', checkIn: null, checkOut: null, status: 'absent', attendanceDays: 22, totalDays: 25 },
    { id: 'CH008', name: 'Ananya Desai', age: 10, grade: '5th', photo: 'A', checkIn: '08:22 AM', checkOut: '04:28 PM', status: 'present', attendanceDays: 23, totalDays: 25 },
    { id: 'CH009', name: 'Rohan Joshi', age: 11, grade: '6th', photo: 'R', checkIn: null, checkOut: null, status: 'absent', attendanceDays: 21, totalDays: 25 },
    { id: 'CH010', name: 'Ishita Gupta', age: 9, grade: '4th', photo: 'I', checkIn: '08:28 AM', checkOut: '04:32 PM', status: 'present', attendanceDays: 24, totalDays: 25 },
    { id: 'CH011', name: 'Dhruv Shah', age: 12, grade: '6th', photo: 'D', checkIn: '08:16 AM', checkOut: '04:27 PM', status: 'present', attendanceDays: 23, totalDays: 25 },
    { id: 'CH012', name: 'Maya Iyer', age: 10, grade: '5th', photo: 'M', checkIn: '08:24 AM', checkOut: '04:22 PM', status: 'present', attendanceDays: 25, totalDays: 25 },
    { id: 'CH013', name: 'Samarth Rao', age: 13, grade: '7th', photo: 'S', checkIn: '08:19 AM', checkOut: '04:38 PM', status: 'present', attendanceDays: 22, totalDays: 25 },
    { id: 'CH014', name: 'Tara Menon', age: 8, grade: '3rd', photo: 'T', checkIn: '08:26 AM', checkOut: '04:18 PM', status: 'present', attendanceDays: 24, totalDays: 25 },
    { id: 'CH015', name: 'Neeraj Agarwal', age: 11, grade: '6th', photo: 'N', checkIn: '08:21 AM', checkOut: '04:29 PM', status: 'present', attendanceDays: 23, totalDays: 25 },
    { id: 'CH016', name: 'Pooja Venkatesh', age: 10, grade: '5th', photo: 'P', checkIn: '08:23 AM', checkOut: '04:26 PM', status: 'present', attendanceDays: 24, totalDays: 25 },
    { id: 'CH017', name: 'Aditya Kulkarni', age: 12, grade: '6th', photo: 'A', checkIn: '08:17 AM', checkOut: '04:31 PM', status: 'present', attendanceDays: 22, totalDays: 25 },
    { id: 'CH018', name: 'Diya Bhatt', age: 9, grade: '4th', photo: 'D', checkIn: '08:29 AM', checkOut: '04:24 PM', status: 'present', attendanceDays: 25, totalDays: 25 },
    { id: 'CH019', name: 'Karan Malhotra', age: 13, grade: '7th', photo: 'K', checkIn: null, checkOut: null, status: 'absent', attendanceDays: 20, totalDays: 25 },
    { id: 'CH020', name: 'Radha Krishnan', age: 11, grade: '6th', photo: 'R', checkIn: '08:27 AM', checkOut: '04:33 PM', status: 'present', attendanceDays: 23, totalDays: 25 },
    { id: 'CH021', name: 'Lakshmi Subramanian', age: 10, grade: '5th', photo: 'L', checkIn: '08:31 AM', checkOut: '04:21 PM', status: 'present', attendanceDays: 24, totalDays: 25 },
    { id: 'CH022', name: 'Harsh Trivedi', age: 12, grade: '6th', photo: 'H', checkIn: '08:14 AM', checkOut: '04:36 PM', status: 'present', attendanceDays: 22, totalDays: 25 },
    { id: 'CH023', name: 'Riya Chaturvedi', age: 9, grade: '4th', photo: 'R', checkIn: '08:32 AM', checkOut: '04:19 PM', status: 'present', attendanceDays: 25, totalDays: 25 },
    { id: 'CH024', name: 'Yashvardhan Jha', age: 13, grade: '8th', photo: 'Y', checkIn: '08:13 AM', checkOut: '04:42 PM', status: 'present', attendanceDays: 21, totalDays: 25 },
    { id: 'CH025', name: 'Zara Khan', age: 11, grade: '6th', photo: 'Z', checkIn: '08:33 AM', checkOut: '04:23 PM', status: 'present', attendanceDays: 24, totalDays: 25 }
];

let childrenData = [];
let filteredData = [];

// Transform API data to match expected format
function transformApiChildData(apiChild) {
    // New format directly from backend: id, name, date, checkIn, checkOut, status
    return {
        id: apiChild.id || '',
        name: apiChild.name || 'Unknown',
        date: apiChild.date || '',
        checkIn: apiChild.checkIn || null,
        checkOut: apiChild.checkOut || null,
        status: apiChild.status || 'Absent'
    };
}

// Format time from API response
function formatTime(timeString) {
    if (!timeString) return null;
    
    // If already formatted, return as is
    if (typeof timeString === 'string' && timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
    }
    
    // If it's an ISO string or timestamp, format it
    try {
        const date = new Date(timeString);
        if (isNaN(date.getTime())) return timeString;
        
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    } catch (e) {
        return timeString;
    }
}

// Fetch attendance data from API
async function fetchAttendanceData(dateFilter = 'today') {
    if (!USE_API) {
        return mockChildrenData;
    }
    
    try {
        let result;
        
        // Determine date range based on filter
        const today = new Date();
        let startDate, endDate;
        
        switch(dateFilter) {
            case 'today':
                startDate = today.toISOString().split('T')[0];
                endDate = startDate;
                result = await ApiService.getTodayAttendance();
                break;
            case 'week':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                endDate = today.toISOString().split('T')[0];
                result = await ApiService.getAttendanceRange(startDate.toISOString().split('T')[0], endDate);
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = today.toISOString().split('T')[0];
                result = await ApiService.getAttendanceRange(startDate.toISOString().split('T')[0], endDate);
                break;
            default:
                result = await ApiService.getTodayAttendance();
        }
        
        if (result.success && result.data) {
            // Handle different API response formats
            let children = [];
            
            if (Array.isArray(result.data)) {
                children = result.data;
            } else if (result.data.children && Array.isArray(result.data.children)) {
                children = result.data.children;
            } else if (result.data.attendance && Array.isArray(result.data.attendance)) {
                children = result.data.attendance;
            } else if (result.data.list && Array.isArray(result.data.list)) {
                children = result.data.list;
            }
            
            // Transform each child's data
            return children.map(transformApiChildData).map(child => ({
                ...child,
                checkIn: formatTime(child.checkIn),
                checkOut: formatTime(child.checkOut)
            }));
        } else {
            console.warn('API request failed, using mock data:', result.error);
            return mockChildrenData;
        }
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        return mockChildrenData;
    }
}

// Render attendance data in table format
function renderAttendanceCards(data = filteredData) {
    const grid = document.getElementById('attendanceGrid');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--gray-500);">No records found</div>';
        return;
    }

    grid.innerHTML = `
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(record => `
                    <tr>
                        <td>${record.id}</td>
                        <td>${record.name}</td>
                        <td>${record.date}</td>
                        <td>${record.checkIn || '—'}</td>
                        <td>${record.checkOut || '—'}</td>
                        <td>
                            <span class="status-badge ${(record.status || 'Absent').toLowerCase()}">
                                ${record.status || 'Absent'}
                            </span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Update summary counts
function updateSummary() {
    // Handle both 'Present' and 'present' (case-insensitive)
    const present = filteredData.filter(c => {
        const status = (c.status || '').toLowerCase();
        return status === 'present' || status === 'p';
    }).length;
    const absent = filteredData.filter(c => {
        const status = (c.status || '').toLowerCase();
        return status === 'absent' || status === 'a';
    }).length;
    const total = filteredData.length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('presentCount').textContent = present;
    document.getElementById('absentCount').textContent = absent;
}

// Filter by status
function filterByStatus(status) {
    if (status === 'all') {
        filteredData = [...childrenData];
    } else {
        // Map frontend filter values to backend status values (case-insensitive)
        filteredData = childrenData.filter(record => {
            const recordStatus = (record.status || '').toLowerCase();
            if (status === 'present') {
                return recordStatus === 'present' || recordStatus === 'p';
            } else if (status === 'absent') {
                return recordStatus === 'absent' || recordStatus === 'a';
            }
            return false;
        });
    }
    renderAttendanceCards();
    updateSummary();
}

// Search function
function searchChildren(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
        filteredData = [...childrenData];
    } else {
        filteredData = childrenData.filter(child => 
            (child.name && child.name.toLowerCase().includes(searchTerm)) ||
            (child.id && child.id.toLowerCase().includes(searchTerm))
        );
    }
    renderAttendanceCards();
    updateSummary();
}

// Initialize attendance page
async function initAttendance() {
    // Show loading state
    const grid = document.getElementById('attendanceGrid');
    if (grid) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">Loading attendance data...</div>';
    }
    
    // Get selected date filter
    const dateSelect = document.getElementById('dateSelect');
    const dateFilter = dateSelect ? dateSelect.value : 'today';
    
    // Fetch data
    childrenData = await fetchAttendanceData(dateFilter);
    filteredData = [...childrenData];
    
    // Render and update
    renderAttendanceCards();
    updateSummary();
    
    // Setup event handlers
    setupEventHandlers();
}

// Setup event handlers
function setupEventHandlers() {
    // Search input handler
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchChildren(e.target.value);
        });
    }
    
    // Filter handler
    const filterSelect = document.getElementById('filterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterByStatus(e.target.value);
        });
    }
    
    // Date filter handler
    const dateSelect = document.getElementById('dateSelect');
    if (dateSelect) {
        dateSelect.addEventListener('change', async (e) => {
            // Reload data for selected date range
            await initAttendance();
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initAttendance();
    
    // Auto-refresh if enabled
    if (USE_API && typeof API_CONFIG !== 'undefined' && API_CONFIG.refreshInterval > 0) {
        setInterval(async () => {
            await initAttendance();
        }, API_CONFIG.refreshInterval);
    }
});
