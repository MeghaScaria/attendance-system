// Directory page functionality

let employeeTypeMap = {};
let employeeNameMap = {};
let allEmployees = [];

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
        }
    } catch (error) {
        console.error('Error loading employee names:', error);
    }
}

// Normalize employee code to string
function normalizeEmpCode(empCode) {
    if (empCode === null || empCode === undefined) return '';
    return String(empCode).trim();
}

// Get employee type (handles both string and number)
function getEmployeeType(empCode) {
    const normalized = normalizeEmpCode(empCode);
    return employeeTypeMap[normalized] || 'unknown';
}

// Get correct employee name (override API name if mapping exists)
function getEmployeeName(empCode, apiName) {
    const normalized = normalizeEmpCode(empCode);
    return employeeNameMap[normalized] || apiName || 'Unknown';
}

// Create complete employee list from employee-names.json (source of truth)
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

// Filter employees based on search and type
function filterEmployees(employees, searchTerm, typeFilter) {
    let filtered = employees;
    
    // Filter by type
    if (typeFilter !== 'all') {
        filtered = filtered.filter(emp => {
            const empCode = normalizeEmpCode(emp.id || emp.empCode || '');
            return getEmployeeType(empCode) === typeFilter;
        });
    }
    
    // Filter by search term
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(emp => {
            const empCode = normalizeEmpCode(emp.id || emp.empCode || '');
            const name = getEmployeeName(empCode, emp.name).toLowerCase();
            return name.includes(searchLower) || empCode.includes(searchTerm);
        });
    }
    
    return filtered;
}

// Render directory grid with separate sections for Students and Teachers
function renderDirectory(employees) {
    const gridContainer = document.getElementById('directoryGrid');
    
    if (!gridContainer) return;
    
    // Separate students and teachers
    const students = employees.filter(emp => {
        const empCode = normalizeEmpCode(emp.id || emp.empCode || '');
        return getEmployeeType(empCode) === 'student';
    });
    
    const teachers = employees.filter(emp => {
        const empCode = normalizeEmpCode(emp.id || emp.empCode || '');
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
    
    // Update counts
    const totalCount = employees.length;
    const studentCount = students.length;
    const teacherCount = teachers.length;
    
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('studentCount').textContent = studentCount;
    document.getElementById('teacherCount').textContent = teacherCount;
    
    // Get type filter to determine which sections to show
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    
    let html = '';
    
    // Render Students section
    if (typeFilter === 'all' || typeFilter === 'student') {
        html += `
            <div class="directory-section">
                <h3 class="section-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    Students (${studentCount})
                </h3>
                <div class="directory-section-content">
                    ${students.length === 0 ? `
                        <div class="empty-state-small">
                            <p>No students found.</p>
                        </div>
                    ` : students.map(emp => {
                        const empCode = normalizeEmpCode(emp.id || emp.empCode || '');
                        const name = getEmployeeName(empCode, emp.name);
                        const avatar = name.charAt(0).toUpperCase();
                        return `
                            <div class="directory-card">
                                <div class="directory-avatar">${avatar}</div>
                                <div class="directory-info">
                                    <h4>${name}</h4>
                                    <p class="directory-id">ID: ${empCode}</p>
                                    <span class="type-badge type-student">Student</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Render Teachers section
    if (typeFilter === 'all' || typeFilter === 'teacher') {
        html += `
            <div class="directory-section">
                <h3 class="section-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Teachers (${teacherCount})
                </h3>
                <div class="directory-section-content">
                    ${teachers.length === 0 ? `
                        <div class="empty-state-small">
                            <p>No teachers found.</p>
                        </div>
                    ` : teachers.map(emp => {
                        const empCode = normalizeEmpCode(emp.id || emp.empCode || '');
                        const name = getEmployeeName(empCode, emp.name);
                        const avatar = name.charAt(0).toUpperCase();
                        return `
                            <div class="directory-card">
                                <div class="directory-avatar">${avatar}</div>
                                <div class="directory-info">
                                    <h4>${name}</h4>
                                    <p class="directory-id">ID: ${empCode}</p>
                                    <span class="type-badge type-teacher">Teacher</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    if (html === '') {
        html = `
            <div class="empty-state">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--gray-400); margin-bottom: 16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <h3>No Employees Found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
    }
    
    gridContainer.innerHTML = html;
}

// Initialize directory page
async function initDirectory() {
    // Load employee types and names FIRST (must complete before creating employee list)
    await Promise.all([loadEmployeeTypes(), loadEmployeeNames()]);
    
    // Verify data loaded
    if (Object.keys(employeeNameMap).length === 0) {
        console.error('Failed to load employee names. Directory will be empty.');
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('directoryGrid').innerHTML = `
            <div class="error-state">
                <p style="color: var(--danger-color);">Error: Could not load employee data.</p>
            </div>
        `;
        return;
    }
    
    // Show loading state
    document.getElementById('loadingState').style.display = 'block';
    
    try {
        // Create complete employee list from employee-names.json (source of truth)
        allEmployees = createCompleteEmployeeList();
        document.getElementById('loadingState').style.display = 'none';
        
        // Render initial directory
        renderDirectory(allEmployees);
    } catch (error) {
        console.error('Error initializing directory:', error);
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('directoryGrid').innerHTML = `
            <div class="error-state">
                <p style="color: var(--danger-color);">Error loading directory: ${error.message}</p>
            </div>
        `;
    }
}

// Setup event handlers
function setupEventHandlers() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    
    // Search input handler
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        const type = typeFilter.value;
        const filtered = filterEmployees(allEmployees, searchTerm, type);
        renderDirectory(filtered);
    });
    
    // Type filter handler
    typeFilter.addEventListener('change', function() {
        const searchTerm = searchInput.value.trim();
        const type = this.value;
        const filtered = filterEmployees(allEmployees, searchTerm, type);
        renderDirectory(filtered);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initDirectory();
    setupEventHandlers();
});
