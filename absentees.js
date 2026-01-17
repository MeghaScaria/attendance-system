// Absentees page functionality

let employeeTypeMap = {};

// Load employee types mapping
async function loadEmployeeTypes() {
    try {
        const response = await fetch('employee-types.json');
        if (response.ok) {
            const data = await response.json();
            employeeTypeMap = data.employeeTypes || {};
        }
    } catch (error) {
        console.error('Error loading employee types:', error);
    }
}

// Parse date from DD/MM/YYYY format
function parseDate(dateString) {
    if (!dateString) return null;
    
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    
    return new Date(dateString);
}

// Format date to YYYY-MM-DD for input
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display
function formatDateForDisplay(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Get employee type
function getEmployeeType(empCode) {
    return employeeTypeMap[empCode] || 'unknown';
}

// Fetch absentees for a specific date
async function fetchAbsentees(date) {
    try {
        // Format date as YYYY-MM-DD
        const dateStr = formatDateForInput(date);
        
        // Fetch attendance for the selected date
        const result = await ApiService.getAttendanceRange(dateStr, dateStr);
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch attendance data');
        }
        
        // Get all employees list
        const childrenResult = await ApiService.getChildren();
        if (!childrenResult.success) {
            throw new Error('Failed to fetch employees list');
        }
        
        const allEmployees = childrenResult.data || [];
        const attendanceRecords = result.data || [];
        
        // Create a map of employees who were present
        const presentEmployees = new Set();
        attendanceRecords.forEach(record => {
            const status = (record.status || '').toLowerCase();
            if (status === 'present' || status === 'p') {
                presentEmployees.add(record.id || record.empCode || '');
            }
        });
        
        // Find absentees (employees not in present list)
        const absentees = allEmployees.filter(emp => {
            const empCode = emp.id || emp.empCode || '';
            return !presentEmployees.has(empCode);
        });
        
        return absentees;
    } catch (error) {
        console.error('Error fetching absentees:', error);
        throw error;
    }
}

// Render absentees list
function renderAbsentees(absentees, selectedType = 'all') {
    const listContainer = document.getElementById('absenteesList');
    
    if (!listContainer) return;
    
    // Filter by type if needed
    let filteredAbsentees = absentees;
    if (selectedType !== 'all') {
        filteredAbsentees = absentees.filter(emp => {
            const empCode = emp.id || emp.empCode || '';
            return getEmployeeType(empCode) === selectedType;
        });
    }
    
    // Update counts
    const totalAbsent = filteredAbsentees.length;
    const absentStudents = filteredAbsentees.filter(emp => {
        const empCode = emp.id || emp.empCode || '';
        return getEmployeeType(empCode) === 'student';
    }).length;
    const absentTeachers = filteredAbsentees.filter(emp => {
        const empCode = emp.id || emp.empCode || '';
        return getEmployeeType(empCode) === 'teacher';
    }).length;
    
    document.getElementById('totalAbsent').textContent = totalAbsent;
    document.getElementById('absentStudents').textContent = absentStudents;
    document.getElementById('absentTeachers').textContent = absentTeachers;
    
    if (filteredAbsentees.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--gray-400); margin-bottom: 16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>No Absentees</h3>
                <p>Everyone is present on this date!</p>
            </div>
        `;
        return;
    }
    
    // Sort by name
    filteredAbsentees.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    listContainer.innerHTML = filteredAbsentees.map(emp => {
        const empCode = emp.id || emp.empCode || '';
        const type = getEmployeeType(empCode);
        const name = emp.name || 'Unknown';
        const avatar = name.charAt(0).toUpperCase();
        
        return `
            <div class="absentee-card">
                <div class="absentee-avatar">${avatar}</div>
                <div class="absentee-info">
                    <h4>${name}</h4>
                    <p>ID: ${empCode}</p>
                </div>
                <div class="absentee-type">
                    <span class="type-badge type-${type}">${type === 'student' ? 'Student' : type === 'teacher' ? 'Teacher' : 'Unknown'}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Initialize absentees page
async function initAbsentees() {
    // Load employee types
    await loadEmployeeTypes();
    
    // Set default date to today
    const datePicker = document.getElementById('datePicker');
    const today = new Date();
    datePicker.value = formatDateForInput(today);
    datePicker.max = formatDateForInput(today); // Can't select future dates
    
    // Update display date
    document.getElementById('selectedDate').textContent = formatDateForDisplay(today);
    
    // Show loading state
    document.getElementById('loadingState').style.display = 'block';
    
    // Fetch and display absentees
    try {
        const absentees = await fetchAbsentees(today);
        document.getElementById('loadingState').style.display = 'none';
        renderAbsentees(absentees);
    } catch (error) {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('absenteesList').innerHTML = `
            <div class="error-state">
                <p style="color: var(--danger-color);">Error loading absentees: ${error.message}</p>
            </div>
        `;
    }
}

// Setup event handlers
function setupEventHandlers() {
    const datePicker = document.getElementById('datePicker');
    const typeFilter = document.getElementById('typeFilter');
    
    datePicker.addEventListener('change', async function() {
        const selectedDate = new Date(this.value);
        document.getElementById('selectedDate').textContent = formatDateForDisplay(selectedDate);
        
        document.getElementById('loadingState').style.display = 'block';
        
        try {
            const absentees = await fetchAbsentees(selectedDate);
            document.getElementById('loadingState').style.display = 'none';
            renderAbsentees(absentees, typeFilter.value);
        } catch (error) {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('absenteesList').innerHTML = `
                <div class="error-state">
                    <p style="color: var(--danger-color);">Error loading absentees: ${error.message}</p>
                </div>
            `;
        }
    });
    
    typeFilter.addEventListener('change', async function() {
        const datePicker = document.getElementById('datePicker');
        const selectedDate = new Date(datePicker.value);
        
        document.getElementById('loadingState').style.display = 'block';
        
        try {
            const absentees = await fetchAbsentees(selectedDate);
            document.getElementById('loadingState').style.display = 'none';
            renderAbsentees(absentees, this.value);
        } catch (error) {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('absenteesList').innerHTML = `
                <div class="error-state">
                    <p style="color: var(--danger-color);">Error loading absentees: ${error.message}</p>
                </div>
            `;
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initAbsentees();
    setupEventHandlers();
});
