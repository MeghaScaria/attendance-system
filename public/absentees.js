// Absentees page functionality

let employeeTypeMap = {};
let employeeNameMap = {};

// Load employee types mapping
async function loadEmployeeTypes() {
    try {
        const response = await fetch('/data/employee-types.json');
        if (response.ok) {
            const data = await response.json();
            employeeTypeMap = data.employeeTypes || {};
        }
    } catch (error) {
        console.error('Error loading employee types:', error);
    }
}

// Load employee names mapping
async function loadEmployeeNames() {
    try {
        const response = await fetch('/data/employee-names.json');
        if (response.ok) {
            const data = await response.json();
            employeeNameMap = data.employeeNames || {};
            console.log('✓ Loaded employee names:', Object.keys(employeeNameMap).length, 'entries');
        } else {
            console.error('Failed to load employee-names.json:', response.status);
        }
    } catch (error) {
        console.error('Error loading employee names:', error);
    }
}

// Get correct employee name (override API name if mapping exists)
function getEmployeeName(empCode, apiName) {
    return employeeNameMap[empCode] || apiName || 'Unknown';
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

// Create complete employee list from employee-names.json
function createCompleteEmployeeList() {
    const allEmployees = [];
    
    // Get all employee codes from employeeNameMap
    Object.keys(employeeNameMap).forEach(empCode => {
        const name = employeeNameMap[empCode];
        const type = getEmployeeType(empCode);
        
        allEmployees.push({
            id: empCode,
            empCode: empCode,
            name: name,
            type: type
        });
    });
    
    console.log('Created complete employee list:', allEmployees.length, 'employees');
    console.log('Students:', allEmployees.filter(e => e.type === 'student').length);
    console.log('Teachers:', allEmployees.filter(e => e.type === 'teacher').length);
    
    return allEmployees;
}

// Fetch absentees for a specific date
async function fetchAbsentees(date) {
    try {
        // Format date as YYYY-MM-DD
        const dateStr = formatDateForInput(date);
        
        // Get ALL employees from employee-names.json FIRST (complete list - source of truth)
        const allEmployees = createCompleteEmployeeList();
        console.log('Total employees from names file:', allEmployees.length);
        
        // Fetch attendance for the selected date
        const result = await ApiService.getAttendanceRange(dateStr, dateStr);
        
        // Create a map of employees who were present (have check-in time)
        const presentEmployees = new Set();
        
        if (result.success && result.data) {
            const attendanceRecords = result.data || [];
            attendanceRecords.forEach(record => {
                const empCode = record.id || record.empCode || '';
                const checkIn = record.checkIn;
                // If they have a check-in time, they are present
                if (empCode && checkIn && checkIn !== '--:--' && checkIn !== null && checkIn !== '') {
                    presentEmployees.add(empCode);
                }
            });
        }
        
        console.log('Employees with check-in time (present):', presentEmployees.size);
        
        // Find absentees (employees from our complete list who are NOT in present list)
        // IMPORTANT: Only include employees from employee-names.json, ignore any from API that aren't in our list
        const absentees = allEmployees.filter(emp => {
            const empCode = emp.id || emp.empCode || '';
            // Only include if they're in our employee list AND not present
            return !presentEmployees.has(empCode);
        });
        
        console.log('Total absentees:', absentees.length);
        return absentees;
    } catch (error) {
        console.error('Error fetching absentees:', error);
        // Even on error, return complete employee list as absentees
        return createCompleteEmployeeList();
    }
}

// Render absentees list with separate sections
function renderAbsentees(absentees, selectedType = 'all') {
    const listContainer = document.getElementById('absenteesList');
    
    if (!listContainer) return;
    
    // Separate students and teachers
    const absentStudents = absentees.filter(emp => {
        const empCode = emp.id || emp.empCode || '';
        return getEmployeeType(empCode) === 'student';
    });
    
    const absentTeachers = absentees.filter(emp => {
        const empCode = emp.id || emp.empCode || '';
        return getEmployeeType(empCode) === 'teacher';
    });
    
    // Update counts
    const totalAbsent = absentees.length;
    const studentCount = absentStudents.length;
    const teacherCount = absentTeachers.length;
    
    document.getElementById('totalAbsent').textContent = totalAbsent;
    document.getElementById('absentStudents').textContent = studentCount;
    document.getElementById('absentTeachers').textContent = teacherCount;
    
    // Sort by name
    absentStudents.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    absentTeachers.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    // Render based on selected type
    let html = '';
    
    if (selectedType === 'all' || selectedType === 'student') {
        // Students section
        html += `
            <div class="absentees-section">
                <h3 class="section-title">Students (${studentCount})</h3>
                <div class="absentees-section-content">
                    ${studentCount === 0 ? `
                        <div class="empty-state-small">
                            <p>No students absent</p>
                        </div>
                    ` : absentStudents.map(emp => {
                        const empCode = emp.id || emp.empCode || '';
                        const name = getEmployeeName(empCode, emp.name);
                        const avatar = name.charAt(0).toUpperCase();
                        return `
                            <div class="absentee-card">
                                <div class="absentee-avatar">${avatar}</div>
                                <div class="absentee-info">
                                    <h4>${name}</h4>
                                    <p>ID: ${empCode}</p>
                                </div>
                                <div class="absentee-type">
                                    <span class="type-badge type-student">Student</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    if (selectedType === 'all' || selectedType === 'teacher') {
        // Teachers section
        html += `
            <div class="absentees-section">
                <h3 class="section-title">Teachers (${teacherCount})</h3>
                <div class="absentees-section-content">
                    ${teacherCount === 0 ? `
                        <div class="empty-state-small">
                            <p>No teachers absent</p>
                        </div>
                    ` : absentTeachers.map(emp => {
                        const empCode = emp.id || emp.empCode || '';
                        const name = getEmployeeName(empCode, emp.name);
                        const avatar = name.charAt(0).toUpperCase();
                        return `
                            <div class="absentee-card">
                                <div class="absentee-avatar">${avatar}</div>
                                <div class="absentee-info">
                                    <h4>${name}</h4>
                                    <p>ID: ${empCode}</p>
                                </div>
                                <div class="absentee-type">
                                    <span class="type-badge type-teacher">Teacher</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    if (totalAbsent === 0) {
        html = `
            <div class="empty-state">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--gray-400); margin-bottom: 16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>No Absentees</h3>
                <p>Everyone is present on this date!</p>
            </div>
        `;
    }
    
    listContainer.innerHTML = html;
}

// Initialize absentees page
async function initAbsentees() {
    // Load employee types and names
    await Promise.all([loadEmployeeTypes(), loadEmployeeNames()]);
    
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
            const currentFilter = typeFilter.value;
            renderAbsentees(absentees, currentFilter);
        } catch (error) {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('absenteesList').innerHTML = `
                <div class="error-state">
                    <p style="color: var(--danger-color);">Error loading absentees: ${error.message}</p>
                </div>
            `;
        }
    });
    
    typeFilter.addEventListener('change', function() {
        // Just re-render with the same data, applying the new filter
        const datePicker = document.getElementById('datePicker');
        const selectedDate = new Date(datePicker.value);
        
        document.getElementById('loadingState').style.display = 'block';
        
        // Fetch fresh data and apply filter
        fetchAbsentees(selectedDate).then(absentees => {
            document.getElementById('loadingState').style.display = 'none';
            renderAbsentees(absentees, this.value);
        }).catch(error => {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('absenteesList').innerHTML = `
                <div class="error-state">
                    <p style="color: var(--danger-color);">Error loading absentees: ${error.message}</p>
                </div>
            `;
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initAbsentees();
    setupEventHandlers();
});
