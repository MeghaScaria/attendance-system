// Directory page functionality

let employeeTypeMap = {};
let employeeNameMap = {};
let allEmployees = [];

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

// Load employee names mapping
async function loadEmployeeNames() {
    try {
        const response = await fetch('employee-names.json');
        if (response.ok) {
            const data = await response.json();
            employeeNameMap = data.employeeNames || {};
        }
    } catch (error) {
        console.error('Error loading employee names:', error);
    }
}

// Get employee type
function getEmployeeType(empCode) {
    return employeeTypeMap[empCode] || 'unknown';
}

// Get correct employee name (override API name if mapping exists)
function getEmployeeName(empCode, apiName) {
    return employeeNameMap[empCode] || apiName || 'Unknown';
}

// Fetch all employees
async function fetchEmployees() {
    try {
        const result = await ApiService.getChildrenList();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch employees');
        }
        
        return result.data || [];
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
}

// Filter employees based on search and type
function filterEmployees(employees, searchTerm, typeFilter) {
    let filtered = employees;
    
    // Filter by type
    if (typeFilter !== 'all') {
        filtered = filtered.filter(emp => {
            const empCode = emp.id || emp.empCode || '';
            return getEmployeeType(empCode) === typeFilter;
        });
    }
    
    // Filter by search term
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(emp => {
            const empCode = (emp.id || emp.empCode || '').toString();
            const name = getEmployeeName(empCode, emp.name).toLowerCase();
            return name.includes(searchLower) || empCode.includes(searchTerm);
        });
    }
    
    return filtered;
}

// Render directory grid
function renderDirectory(employees) {
    const gridContainer = document.getElementById('directoryGrid');
    
    if (!gridContainer) return;
    
    // Sort by name
    const sorted = [...employees].sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    // Update counts
    const totalCount = sorted.length;
    const studentCount = sorted.filter(emp => {
        const empCode = emp.id || emp.empCode || '';
        return getEmployeeType(empCode) === 'student';
    }).length;
    const teacherCount = sorted.filter(emp => {
        const empCode = emp.id || emp.empCode || '';
        return getEmployeeType(empCode) === 'teacher';
    }).length;
    
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('studentCount').textContent = studentCount;
    document.getElementById('teacherCount').textContent = teacherCount;
    
    if (sorted.length === 0) {
        gridContainer.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--gray-400); margin-bottom: 16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <h3>No Employees Found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    gridContainer.innerHTML = sorted.map(emp => {
        const empCode = emp.id || emp.empCode || '';
        const type = getEmployeeType(empCode);
        const name = getEmployeeName(empCode, emp.name);
        const avatar = name.charAt(0).toUpperCase();
        
        return `
            <div class="directory-card">
                <div class="directory-avatar">${avatar}</div>
                <div class="directory-info">
                    <h4>${name}</h4>
                    <p class="directory-id">ID: ${empCode}</p>
                    <span class="type-badge type-${type}">${type === 'student' ? 'Student' : type === 'teacher' ? 'Teacher' : 'Unknown'}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Initialize directory page
async function initDirectory() {
    // Load employee types and names
    await Promise.all([loadEmployeeTypes(), loadEmployeeNames()]);
    
    // Show loading state
    document.getElementById('loadingState').style.display = 'block';
    
    try {
        // Fetch all employees
        allEmployees = await fetchEmployees();
        document.getElementById('loadingState').style.display = 'none';
        
        // Render initial directory
        renderDirectory(allEmployees);
    } catch (error) {
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
