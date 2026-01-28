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
let employeeTypeMap = {}; // Maps employee code to 'student' or 'teacher'
let employeeNameMap = {}; // Maps employee code to correct name (English)
let employeeNameMapKn = {}; // Maps employee code to Kannada name
let attendanceHandlersSetup = false; // Ensure event handlers are only attached once

// Load employee type mapping from JSON file
async function loadEmployeeTypes() {
    try {
        const response = await fetch('/data/employee-types.json');
        if (response.ok) {
            const data = await response.json();
            employeeTypeMap = data.employeeTypes || {};
            console.log('Loaded employee types:', Object.keys(employeeTypeMap).length, 'entries');
        } else {
            console.warn('Could not load employee-types.json, using empty mapping');
            employeeTypeMap = {};
        }
    } catch (error) {
        console.warn('Error loading employee types:', error);
        employeeTypeMap = {};
    }
}

// Load employee names mapping from JSON file
async function loadEmployeeNames() {
    try {
        const response = await fetch('/data/employee-names.json');
        if (response.ok) {
            const data = await response.json();
            employeeNameMap = data.employeeNames || {};
            console.log('Loaded employee names:', Object.keys(employeeNameMap).length, 'entries');
        } else {
            console.warn('Could not load employee-names.json, using empty mapping');
            employeeNameMap = {};
        }
    } catch (error) {
        console.warn('Error loading employee names:', error);
        employeeNameMap = {};
    }
}

// Load Kannada names for display when language is Kannada
async function loadEmployeeNamesKannada() {
    try {
        const response = await fetch('/data/employee-names-kannada.json');
        if (response.ok) {
            const data = await response.json();
            employeeNameMapKn = data.employeeNamesKn || {};
        } else {
            employeeNameMapKn = {};
        }
    } catch (error) {
        employeeNameMapKn = {};
    }
}

// Normalize employee code to string
function normalizeEmpCode(empCode) {
    if (empCode === null || empCode === undefined) return '';
    return String(empCode).trim();
}

// Get employee type (student or teacher) based on employee code (handles both string and number)
function getEmployeeType(employeeCode) {
    const normalized = normalizeEmpCode(employeeCode);
    return employeeTypeMap[normalized] || 'unknown';
}

// Get correct employee name in English (override API name if mapping exists)
function getEmployeeName(empCode, apiName) {
    const n = normalizeEmpCode(empCode);
    return employeeNameMap[n] || apiName || 'Unknown';
}

// Get display name (Kannada when lang is kn, else English)
function getDisplayName(empCode, apiName) {
    const n = normalizeEmpCode(empCode);
    if (typeof window !== 'undefined' && window.i18n && window.i18n.getCurrentLanguage() === 'kn' && employeeNameMapKn[n]) {
        return employeeNameMapKn[n];
    }
    return getEmployeeName(empCode, apiName);
}

// Transform API data to match expected format
function transformApiChildData(apiChild) {
    // New format directly from backend: id, name, date, checkIn, checkOut, status
    const employeeCode = apiChild.id || '';
    
    // Fix: If checkIn exists, status should be Present
    let status = apiChild.status || 'Absent';
    if (apiChild.checkIn && apiChild.checkIn !== '--:--' && apiChild.checkIn !== null) {
        status = 'Present';
    }
    
    return {
        id: employeeCode,
        name: getEmployeeName(employeeCode, apiChild.name),
        date: apiChild.date || '',
        checkIn: apiChild.checkIn || null,
        checkOut: apiChild.checkOut || null,
        status: status,
        type: getEmployeeType(employeeCode) // Add type: 'student', 'teacher', or 'unknown'
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

// Create complete employee list from employee-names.json
// viewDateStr: optional YYYY-MM-DD string for the date we're viewing (used for empty/absent entries)
function createCompleteEmployeeList(attendanceRecords = [], viewDateStr = null) {
    // Create a map of attendance records by employee code
    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
        const empCode = record.id || '';
        if (empCode) {
            attendanceMap.set(empCode, record);
        }
    });
    
    // Date string in DD/MM/YYYY format for display
    let dateStr;
    if (viewDateStr) {
        const [y, m, d] = viewDateStr.split('-');
        dateStr = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    } else {
        const today = new Date();
        dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    }
    
    // Create entries for ALL employees from employee-names.json
    const allEmployees = [];
    
    // Get all employee codes from employeeNameMap
    Object.keys(employeeNameMap).forEach(empCode => {
        const name = employeeNameMap[empCode];
        const attendanceRecord = attendanceMap.get(empCode);
        
        if (attendanceRecord) {
            // Employee has attendance record - use it; when viewDateStr is set, show that date for consistency
            allEmployees.push({
                ...attendanceRecord,
                date: viewDateStr ? dateStr : attendanceRecord.date,
                name: getEmployeeName(empCode, attendanceRecord.name),
                type: getEmployeeType(empCode)
            });
        } else {
            // Employee has no attendance record - create empty entry
            allEmployees.push({
                id: empCode,
                name: name,
                date: dateStr,
                checkIn: null,
                checkOut: null,
                status: 'Absent',
                type: getEmployeeType(empCode)
            });
        }
    });
    
    return allEmployees;
}

// Fetch attendance data from API
async function fetchAttendanceData(dateFilter = 'today', customStartDate = null, customEndDate = null) {
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
            case 'date':
                if (customStartDate) {
                    startDate = customStartDate;
                    endDate = customStartDate;
                    result = await ApiService.getAttendanceRange(startDate, endDate);
                } else {
                    startDate = today.toISOString().split('T')[0];
                    endDate = startDate;
                    result = await ApiService.getTodayAttendance();
                }
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
            case 'custom':
                if (customStartDate && customEndDate) {
                    startDate = customStartDate;
                    endDate = customEndDate;
                    result = await ApiService.getAttendanceRange(startDate, endDate);
                } else {
                    // Fallback to today if custom dates not provided
                    startDate = today.toISOString().split('T')[0];
                    endDate = startDate;
                    result = await ApiService.getTodayAttendance();
                }
                break;
            default:
                result = await ApiService.getTodayAttendance();
        }
        
        let attendanceRecords = [];
        
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
            attendanceRecords = children.map(transformApiChildData).map(child => ({
                ...child,
                checkIn: formatTime(child.checkIn),
                checkOut: formatTime(child.checkOut)
            }));
        }
        
        // View date for single-day views
        const viewDate = (dateFilter === 'today' || dateFilter === 'date' || (dateFilter === 'custom' && startDate === endDate)) ? startDate : null;
        // For single-day view, keep only records for that date (API returns DD/MM/YYYY)
        if (viewDate && attendanceRecords.length > 0) {
            const [y, m, d] = viewDate.split('-');
            const targetDateStr = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
            attendanceRecords = attendanceRecords.filter(r => (r.date || '').trim() === targetDateStr);
        }
        // Create complete list with all employees (including those without attendance)
        const completeList = createCompleteEmployeeList(attendanceRecords, viewDate);
        
        return completeList;
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        // Even on error, return complete employee list
        return createCompleteEmployeeList([]);
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
                    <th>Type</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(record => {
                    const type = (record.type || 'unknown').toLowerCase();
                    const typeLabel = type === 'student' ? 'Student' : type === 'teacher' ? 'Teacher' : '—';
                    const typeClass = type === 'student' ? 'type-student' : type === 'teacher' ? 'type-teacher' : '';
                    return `
                    <tr>
                        <td>${record.id}</td>
                        <td>${getDisplayName(record.id, record.name)}</td>
                        <td>
                            <span class="type-badge ${typeClass}">
                                ${typeLabel}
                            </span>
                        </td>
                        <td>${record.date}</td>
                        <td>${record.checkIn || '—'}</td>
                        <td>${record.checkOut || '—'}</td>
                        <td>
                            <span class="status-badge ${(record.status || 'Absent').toLowerCase()}">
                                ${record.status || 'Absent'}
                            </span>
                        </td>
                    </tr>
                `;
                }).join('')}
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

// Filter by type (student/teacher)
function filterByType(type) {
    applyFilters();
}

// Filter by status
function filterByStatus(status) {
    applyFilters();
}

// Apply all filters (type and status)
function applyFilters() {
    const typeFilter = document.getElementById('typeFilterSelect')?.value || 'all';
    const statusFilter = document.getElementById('filterSelect')?.value || 'all';
    
    filteredData = childrenData.filter(record => {
        // Type filter
        if (typeFilter !== 'all') {
            const recordType = (record.type || 'unknown').toLowerCase();
            if (recordType !== typeFilter) {
                return false;
            }
        }
        
        // Status filter
        if (statusFilter !== 'all') {
            const recordStatus = (record.status || '').toLowerCase();
            if (statusFilter === 'present') {
                if (recordStatus !== 'present' && recordStatus !== 'p') {
                    return false;
                }
            } else if (statusFilter === 'absent') {
                if (recordStatus !== 'absent' && recordStatus !== 'a') {
                    return false;
                }
            }
        }
        
        return true;
    });
    
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

// Refresh attendance data only (fetch + apply filters). Use this from date/single-date handlers so we don't re-attach handlers.
async function refreshAttendanceData() {
    const grid = document.getElementById('attendanceGrid');
    if (grid) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">Loading attendance data...</div>';
    }
    const dateSelect = document.getElementById('dateSelect');
    const dateFilter = dateSelect ? dateSelect.value : 'today';
    let customStartDate = null;
    let customEndDate = null;
    if (dateFilter === 'date') {
        const singleDateInput = document.getElementById('singleDate');
        const val = singleDateInput ? singleDateInput.value : null;
        if (val) {
            customStartDate = val;
            customEndDate = val;
        }
    } else if (dateFilter === 'custom') {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        customStartDate = startDateInput ? startDateInput.value : null;
        customEndDate = endDateInput ? endDateInput.value : null;
    }
    childrenData = await fetchAttendanceData(dateFilter, customStartDate, customEndDate);
    filteredData = [...childrenData];
    applyFilters();
}

// Initialize attendance page (load mappings, fetch data, attach handlers once)
async function initAttendance() {
    const grid = document.getElementById('attendanceGrid');
    if (grid) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">Loading attendance data...</div>';
    }
    await Promise.all([loadEmployeeTypes(), loadEmployeeNames(), loadEmployeeNamesKannada()]);
    const dateSelect = document.getElementById('dateSelect');
    const dateFilter = dateSelect ? dateSelect.value : 'today';
    let customStartDate = null;
    let customEndDate = null;
    if (dateFilter === 'date') {
        const singleDateInput = document.getElementById('singleDate');
        const val = singleDateInput ? singleDateInput.value : null;
        if (val) {
            customStartDate = val;
            customEndDate = val;
        }
    } else if (dateFilter === 'custom') {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        customStartDate = startDateInput ? startDateInput.value : null;
        customEndDate = endDateInput ? endDateInput.value : null;
    }
    childrenData = await fetchAttendanceData(dateFilter, customStartDate, customEndDate);
    filteredData = [...childrenData];
    applyFilters();
    if (!attendanceHandlersSetup) {
        setupEventHandlers();
        attendanceHandlersSetup = true;
    }
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
    
    // Type filter handler (student/teacher)
    const typeFilterSelect = document.getElementById('typeFilterSelect');
    if (typeFilterSelect) {
        typeFilterSelect.addEventListener('change', (e) => {
            filterByType(e.target.value);
        });
    }
    
    // Status filter handler
    const filterSelect = document.getElementById('filterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterByStatus(e.target.value);
        });
    }
    
    // Date filter handler
    const dateSelect = document.getElementById('dateSelect');
    const singleDateContainer = document.getElementById('singleDateContainer');
    const customDateRange = document.getElementById('customDateRange');
    if (dateSelect) {
        dateSelect.addEventListener('change', async (e) => {
            const val = e.target.value;
            if (val === 'date') {
                if (singleDateContainer) singleDateContainer.style.display = 'flex';
                if (customDateRange) customDateRange.style.display = 'none';
                const singleDateInput = document.getElementById('singleDate');
                if (singleDateInput && !singleDateInput.value) {
                    singleDateInput.value = new Date().toISOString().split('T')[0];
                }
            } else if (val === 'custom') {
                if (singleDateContainer) singleDateContainer.style.display = 'none';
                if (customDateRange) {
                    customDateRange.style.display = 'flex';
                    const startDateInput = document.getElementById('startDate');
                    const endDateInput = document.getElementById('endDate');
                    if (startDateInput && endDateInput) {
                        const endDate = new Date();
                        const startDate = new Date();
                        startDate.setDate(endDate.getDate() - 7);
                        startDateInput.value = startDate.toISOString().split('T')[0];
                        endDateInput.value = endDate.toISOString().split('T')[0];
                    }
                }
            } else {
                if (singleDateContainer) singleDateContainer.style.display = 'none';
                if (customDateRange) customDateRange.style.display = 'none';
            }
            await refreshAttendanceData();
        });
    }
    
    // Single-date picker handler (when "Select date" is chosen)
    const singleDateInput = document.getElementById('singleDate');
    if (singleDateInput) {
        singleDateInput.addEventListener('change', async () => {
            if (dateSelect && dateSelect.value === 'date') {
                await refreshAttendanceData();
            }
        });
    }
    // Custom date range handlers
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    if (startDateInput) {
        startDateInput.addEventListener('change', async () => {
            if (dateSelect && dateSelect.value === 'custom') {
                await refreshAttendanceData();
            }
        });
    }
    if (endDateInput) {
        endDateInput.addEventListener('change', async () => {
            if (dateSelect && dateSelect.value === 'custom') {
                await refreshAttendanceData();
            }
        });
    }
    
    // Export/Print PDF button handler
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            exportToPDF();
        });
    }
    // Re-render names when language switches (English/Kannada)
    window.addEventListener('languageChanged', () => {
        renderAttendanceCards(filteredData);
        updateSummary();
    });
}

// Export attendance data to PDF
function exportToPDF() {
    // Get current date range info
    const dateSelect = document.getElementById('dateSelect');
    const dateFilter = dateSelect ? dateSelect.value : 'today';
    let dateRangeText = '';
    
    const today = new Date();
    switch(dateFilter) {
        case 'today':
            dateRangeText = `Date: ${today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            break;
        case 'date':
            const singleDateInput = document.getElementById('singleDate');
            if (singleDateInput && singleDateInput.value) {
                const d = new Date(singleDateInput.value);
                dateRangeText = `Date: ${d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            } else {
                dateRangeText = `Date: ${today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            }
            break;
        case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            dateRangeText = `Date Range: ${weekAgo.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} to ${today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            break;
        case 'month':
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            dateRangeText = `Month: ${firstDay.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
            break;
        case 'custom':
            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');
            if (startDateInput && endDateInput && startDateInput.value && endDateInput.value) {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                dateRangeText = `Date Range: ${startDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} to ${endDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            } else {
                dateRangeText = `Date: ${today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            }
            break;
    }
    
    // Create print-friendly HTML
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintContent(filteredData, dateRangeText);
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };
}

// Generate print-friendly HTML content
function generatePrintContent(data, dateRangeText) {
    // Separate students and teachers
    const students = data.filter(record => {
        const empCode = normalizeEmpCode(record.id || record.empCode || '');
        return getEmployeeType(empCode) === 'student';
    });
    
    const teachers = data.filter(record => {
        const empCode = normalizeEmpCode(record.id || record.empCode || '');
        return getEmployeeType(empCode) === 'teacher';
    });
    
    // Sort by name
    students.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    teachers.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    // Count statistics
    const totalPresent = data.filter(r => (r.status || '').toLowerCase() === 'present' || (r.status || '').toLowerCase() === 'p').length;
    const totalAbsent = data.filter(r => (r.status || '').toLowerCase() === 'absent' || (r.status || '').toLowerCase() === 'a').length;
    
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Attendance Report</title>
    <style>
        @media print {
            @page {
                margin: 1cm;
                size: A4;
            }
            body {
                margin: 0;
                padding: 0;
            }
        }
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
            color: #1f2937;
        }
        .header p {
            margin: 5px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .summary {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 8px;
        }
        .summary-item {
            text-align: center;
        }
        .summary-item strong {
            display: block;
            font-size: 24px;
            color: #1f2937;
        }
        .summary-item span {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
        }
        .section {
            margin: 30px 0;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #d1d5db;
            color: #1f2937;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background-color: #f9fafb;
            font-weight: bold;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
        }
        td {
            font-size: 13px;
        }
        .status-present {
            color: #10b981;
            font-weight: 600;
        }
        .status-absent {
            color: #ef4444;
            font-weight: 600;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        @media print {
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Attendance Report</h1>
        <p>${dateRangeText}</p>
        <p>Generated on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    </div>
    
    <div class="summary">
        <div class="summary-item">
            <strong>${data.length}</strong>
            <span>Total</span>
        </div>
        <div class="summary-item">
            <strong style="color: #10b981;">${totalPresent}</strong>
            <span>Present</span>
        </div>
        <div class="summary-item">
            <strong style="color: #ef4444;">${totalAbsent}</strong>
            <span>Absent</span>
        </div>
        <div class="summary-item">
            <strong>${students.length}</strong>
            <span>Students</span>
        </div>
        <div class="summary-item">
            <strong>${teachers.length}</strong>
            <span>Teachers</span>
        </div>
    </div>
`;
    
    // Students section
    if (students.length > 0) {
        html += `
    <div class="section">
        <div class="section-title">Students (${students.length})</div>
        <table>
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
`;
        students.forEach(record => {
            const empCode = normalizeEmpCode(record.id || record.empCode || '');
            const name = getDisplayName(empCode, record.name);
            const status = (record.status || '').toLowerCase();
            const statusClass = (status === 'present' || status === 'p') ? 'status-present' : 'status-absent';
            const statusText = (status === 'present' || status === 'p') ? 'Present' : 'Absent';
            
            html += `
                <tr>
                    <td>${empCode}</td>
                    <td>${name}</td>
                    <td>${record.date || 'N/A'}</td>
                    <td>${record.checkIn || '--:--'}</td>
                    <td>${record.checkOut || '--:--'}</td>
                    <td class="${statusClass}">${statusText}</td>
                </tr>
`;
        });
        html += `
            </tbody>
        </table>
    </div>
`;
    }
    
    // Teachers section
    if (teachers.length > 0) {
        html += `
    <div class="section">
        <div class="section-title">Teachers (${teachers.length})</div>
        <table>
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
`;
        teachers.forEach(record => {
            const empCode = normalizeEmpCode(record.id || record.empCode || '');
            const name = getDisplayName(empCode, record.name);
            const status = (record.status || '').toLowerCase();
            const statusClass = (status === 'present' || status === 'p') ? 'status-present' : 'status-absent';
            const statusText = (status === 'present' || status === 'p') ? 'Present' : 'Absent';
            
            html += `
                <tr>
                    <td>${empCode}</td>
                    <td>${name}</td>
                    <td>${record.date || 'N/A'}</td>
                    <td>${record.checkIn || '--:--'}</td>
                    <td>${record.checkOut || '--:--'}</td>
                    <td class="${statusClass}">${statusText}</td>
                </tr>
`;
        });
        html += `
            </tbody>
        </table>
    </div>
`;
    }
    
    html += `
    <div class="footer">
        <p>This is a computer-generated report. For official records, please verify with the attendance system.</p>
    </div>
</body>
</html>
`;
    
    return html;
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
