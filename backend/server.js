// Backend Server for Attendance System
// Acts as a proxy between your website and E-Time Office Cloud API

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for your frontend
app.use(express.json());

// Serve static files from public directory (frontend)
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve data files from data directory
app.use('/data', express.static(path.join(__dirname, '..', 'data')));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// JWT Secret (in production, use a strong random string from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// User database (in production, use a real database like MongoDB or PostgreSQL)
// Default users - passwords will be hashed on server startup
// Format: 'username': { password: 'hashed_password', name: 'Display Name', role: 'admin' | 'staff' }
const users = {};

// Initialize default users with hashed passwords
async function initializeUsers() {
    // Hash default passwords and store users
    users['admin'] = {
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: 'admin'
    };
    users['staff'] = {
        password: await bcrypt.hash('staff123', 10),
        name: 'Staff Member',
        role: 'staff'
    };

    console.log('✓ User accounts initialized');
}

// Initialize users on startup
initializeUsers();

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// E-Time Office Cloud API Configuration
const E_TIME_API_CONFIG = {
    baseURL: process.env.E_TIME_API_URL || 'https://api.etimeoffice.com/api', // E-Time Office Cloud API URL
    corporateId: process.env.E_TIME_CORPORATE_ID || 'PrajaKiranaSeva',
    username: process.env.E_TIME_USERNAME || 'PrajaKiranaSeva',
    password: process.env.E_TIME_PASSWORD || 'PrajaKS@123'
};

// Helper function to make authenticated requests to E-Time Office Cloud
// E-Time Office Cloud uses /DownloadInOutPunchData endpoint
async function makeEtimeRequest(params = {}) {
    try {
        // Basic Auth: CorporateID:Username:Password:true encoded in base64
        const authString = `${E_TIME_API_CONFIG.corporateId}:${E_TIME_API_CONFIG.username}:${E_TIME_API_CONFIG.password}:true`;
        const auth = Buffer.from(authString).toString('base64');

        const response = await axios.get(
            `${E_TIME_API_CONFIG.baseURL}/DownloadInOutPunchData`,
            {
                headers: {
                    Authorization: `Basic ${auth}`
                },
                params
            }
        );

        return {
            success: true,
            data: response.data.InOutPunchData || []
        };
    } catch (error) {
        console.error("E-Time API Error:", error.response?.status, error.response?.statusText || error.message);

        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}

// Helper function to format date for E-Time API (DD/MM/YYYY format)
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Transform E-Time InOutPunchData to school-style attendance format
// The API already provides INTime, OUTTime, and Status
function transformAttendanceData(etimeData, filterToday = false) {
    if (!etimeData || !Array.isArray(etimeData)) {
        return [];
    }

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    return etimeData
        .filter(record => {
            // Skip invalid records (normalize Empcode for consistent checking)
            const empCode = normalizeEmpCode(record.Empcode);
            if (!empCode || !record.DateString) return false;

            // If filtering for today, skip other dates
            if (filterToday && record.DateString !== todayStr) return false;

            return true;
        })
        .map(record => {
            const inTime = record.INTime && record.INTime !== '--:--' ? record.INTime : null;
            const outTime = record.OUTTime && record.OUTTime !== '--:--' ? record.OUTTime : null;

            // Fix: If someone has a check-in time, they are Present
            // Only mark as Absent if there's no check-in time AND status is 'A'
            let status = 'Absent';
            if (inTime) {
                // Has check-in time = Present
                status = 'Present';
            } else if (record.Status === 'P') {
                // API says Present but no check-in time (edge case)
                status = 'Present';
            }

            return {
                id: record.Empcode,
                name: record.Name || 'Unknown',
                date: record.DateString,
                checkIn: inTime,
                checkOut: outTime,
                status: status
            };
        });
}

// Format time for display (HH:MM format)
function formatTimeForDisplay(timeString) {
    if (!timeString) return null;

    // If already in HH:MM format, return as is
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
        return timeString;
    }

    // If in HH:MM:SS format, extract HH:MM
    const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (timeMatch) {
        const hours = timeMatch[1].padStart(2, '0');
        const minutes = timeMatch[2];
        return `${hours}:${minutes}`;
    }

    return timeString;
}

// API Routes

// Health check (public route)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend running successfully' });
});

// Login endpoint (public route)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username and password are required'
            });
        }

        // Find user
        const user = users[username];
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid username or password'
            });
        }

        // Check password
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid username or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: username, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        );

        res.json({
            success: true,
            data: {
                token: token,
                user: {
                    username: username,
                    name: user.name,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during login'
        });
    }
});

// Verify token endpoint (protected route - for frontend to check if token is valid)
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: {
            user: req.user
        }
    });
});

// Get today's attendance (protected route)
app.get('/api/attendance/today', authenticateToken, async (req, res) => {
    try {
        const today = new Date();

        // Call E-Time API with correct parameters
        const result = await makeEtimeRequest({
            Empcode: 'ALL',
            FromDate: formatDate(today),
            ToDate: formatDate(today)
        });

        if (!result.success) {
            return res.status(result.status || 500).json({
                success: false,
                error: result.error
            });
        }

        // Transform E-Time punch data to frontend format (filter for today only)
        const transformedData = transformAttendanceData(result.data, true);

        res.json({ success: true, data: transformedData });
    } catch (error) {
        console.error('Error fetching today attendance:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get attendance for date range (protected route)
app.get('/api/attendance/range', authenticateToken, async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({
                success: false,
                error: 'Start and end dates are required (format: YYYY-MM-DD)'
            });
        }

        // Parse dates and format for E-Time API
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        // Call E-Time API with correct parameters
        const result = await makeEtimeRequest({
            Empcode: 'ALL',
            FromDate: formatDate(startDate),
            ToDate: formatDate(endDate)
        });

        if (!result.success) {
            return res.status(result.status || 500).json({
                success: false,
                error: result.error
            });
        }

        // Transform E-Time punch data to frontend format
        const transformedData = transformAttendanceData(result.data);

        res.json({ success: true, data: transformedData });
    } catch (error) {
        console.error('Error fetching attendance range:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all attendance logs (last 30 days by default) (protected route)
app.get('/api/attendance/all', authenticateToken, async (req, res) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30); // Last 30 days

        // Call E-Time API with correct parameters
        const result = await makeEtimeRequest({
            Empcode: 'ALL',
            FromDate: formatDate(startDate),
            ToDate: formatDate(endDate)
        });

        if (!result.success) {
            return res.status(result.status || 500).json({
                success: false,
                error: result.error
            });
        }

        // Transform E-Time punch data to frontend format
        const transformedData = transformAttendanceData(result.data);

        res.json({ success: true, data: transformedData });
    } catch (error) {
        console.error('Error fetching all attendance:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get employee-wise data (protected route)
app.get('/api/attendance/employee/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; // Employee code
        let startDate, endDate;

        // Use query params or default to last 30 days
        if (req.query.start && req.query.end) {
            startDate = new Date(req.query.start);
            endDate = new Date(req.query.end);
        } else {
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(endDate.getDate() - 30);
        }

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        // Call E-Time API with employee code
        const result = await makeEtimeRequest({
            Empcode: id, // Use specific employee code
            FromDate: formatDate(startDate),
            ToDate: formatDate(endDate)
        });

        if (!result.success) {
            return res.status(result.status || 500).json({
                success: false,
                error: result.error
            });
        }

        // Transform E-Time punch data to frontend format
        const transformedData = transformAttendanceData(result.data);

        res.json({ success: true, data: transformedData });
    } catch (error) {
        console.error('Error fetching employee attendance:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get children/employees list (protected route)
// E-Time doesn't have a separate employees endpoint, so we extract unique employees from punch data
app.get('/api/children', authenticateToken, async (req, res) => {
    try {
        // Get attendance data for last 30 days to extract employee list
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const result = await makeEtimeRequest({
            Empcode: 'ALL',
            FromDate: formatDate(startDate),
            ToDate: formatDate(endDate)
        });

        if (!result.success) {
            return res.status(result.status || 500).json({
                success: false,
                error: result.error
            });
        }

        // Extract unique employees from InOutPunchData
        const employeeMap = new Map();

        (result.data || []).forEach(record => {
            const empCode = normalizeEmpCode(record.Empcode);
            const name = record.Name || 'Unknown';

            if (empCode && !employeeMap.has(empCode)) {
                employeeMap.set(empCode, {
                    id: empCode, // Always string
                    empCode: empCode, // Always string
                    name: name,
                    cardNo: '', // E-Time doesn't provide this in InOutPunchData
                    age: 0, // E-Time doesn't provide this
                    grade: '', // E-Time doesn't provide this
                    photo: name ? name.charAt(0).toUpperCase() : '?'
                });
            }
        });

        const children = Array.from(employeeMap.values());

        res.json({ success: true, data: children });
    } catch (error) {
        console.error('Error fetching children list:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Load employee types mapping
const fs = require('fs');
let employeeTypeMap = {};

function loadEmployeeTypes() {
    try {
        const typesPath = path.join(__dirname, '..', 'data', 'employee-types.json');
        console.log('Loading employee types from:', typesPath);
        if (fs.existsSync(typesPath)) {
            const typesData = JSON.parse(fs.readFileSync(typesPath, 'utf8'));
            employeeTypeMap = typesData.employeeTypes || {};
            console.log('✓ Loaded employee types:', Object.keys(employeeTypeMap).length, 'entries');
        } else {
            console.warn('⚠ employee-types.json not found at:', typesPath);
            // Fallback: hardcoded employee types
            employeeTypeMap = {
                "101": "teacher", "102": "teacher", "103": "teacher", "104": "teacher",
                "105": "teacher", "106": "teacher", "107": "teacher",
                "2001": "student", "2002": "student", "2003": "student", "2004": "student",
                "2005": "student", "2006": "student", "2007": "student", "2008": "student",
                "2009": "student", "2010": "student", "2011": "student", "2012": "student",
                "2013": "student", "2014": "student", "2015": "student", "2016": "student",
                "2017": "student", "2018": "student", "2019": "student"
            };
            console.log('✓ Using fallback employee types');
        }
    } catch (error) {
        console.error('Error loading employee types:', error);
        // Fallback: hardcoded employee types
        employeeTypeMap = {
            "101": "teacher", "102": "teacher", "103": "teacher", "104": "teacher",
            "105": "teacher", "106": "teacher", "107": "teacher",
            "2001": "student", "2002": "student", "2003": "student", "2004": "student",
            "2005": "student", "2006": "student", "2007": "student", "2008": "student",
            "2009": "student", "2010": "student", "2011": "student", "2012": "student",
            "2013": "student", "2014": "student", "2015": "student", "2016": "student",
            "2017": "student", "2018": "student", "2019": "student"
        };
    }
}

// Load employee types on server start
loadEmployeeTypes();

// Normalize employee code to string (handles both number and string)
function normalizeEmpCode(empCode) {
    if (empCode === null || empCode === undefined) return '';
    return String(empCode).trim();
}

// Helper function to get employee type (handles both string and number)
function getEmployeeType(empCode) {
    const normalized = normalizeEmpCode(empCode);
    return employeeTypeMap[normalized] || 'unknown';
}

// Get dashboard statistics (protected route)
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const today = new Date();

        // Get today's attendance
        const todayResult = await makeEtimeRequest({
            Empcode: 'ALL',
            FromDate: formatDate(today),
            ToDate: formatDate(today)
        });

        if (!todayResult.success) {
            return res.status(todayResult.status || 500).json({
                success: false,
                error: todayResult.error
            });
        }

        // Get all employees from employee-names.json (complete list)
        const namesPath = path.join(__dirname, '..', 'data', 'employee-names.json');
        let allEmployeeCodes = [];

        try {
            if (fs.existsSync(namesPath)) {
                const namesData = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
                allEmployeeCodes = Object.keys(namesData.employeeNames || {});
                console.log('✓ Loaded employee codes from names file:', allEmployeeCodes.length);
            } else {
                console.warn('⚠ employee-names.json not found at:', namesPath);
            }
        } catch (error) {
            console.error('Error loading employee-names.json:', error);
        }

        // If file loading failed, use hardcoded values (from known data)
        if (allEmployeeCodes.length === 0) {
            console.log('⚠ Using fallback employee codes');
            // All known employee codes from employee-names.json (18 students + 7 staff = 25 total)
            allEmployeeCodes = ['101', '102', '103', '104', '105', '106', '107', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];
        }

        // Separate students and staff
        const students = allEmployeeCodes.filter(code => getEmployeeType(code) === 'student');
        const staff = allEmployeeCodes.filter(code => getEmployeeType(code) === 'teacher');
        const totalStudents = students.length;
        const totalStaff = staff.length;
        const totalChildren = totalStudents; // For backward compatibility

        console.log(`📊 Dashboard stats: ${totalStudents} students, ${totalStaff} staff`);

        // Get unique employees who punched today (with check-in time = Present)
        // Fix: Use check-in time to determine present status, not API Status field
        const todayPresentEmployees = new Set();
        const todayPresentStudents = new Set();
        const todayPresentStaff = new Set();

        (todayResult.data || []).forEach(record => {
            const empCode = normalizeEmpCode(record.Empcode);
            // If they have a check-in time, they are present
            const inTime = record.INTime && record.INTime !== '--:--' && record.INTime !== null;

            if (empCode && inTime) {
                todayPresentEmployees.add(empCode); // Now always string
                const type = getEmployeeType(empCode);
                if (type === 'student') {
                    todayPresentStudents.add(empCode);
                } else if (type === 'teacher') {
                    todayPresentStaff.add(empCode);
                }
            }
        });

        const presentToday = todayPresentEmployees.size;
        const presentStudents = todayPresentStudents.size;
        const presentStaff = todayPresentStaff.size;
        const absentStudents = totalStudents - presentStudents;
        const absentStaff = totalStaff - presentStaff;
        const absentToday = totalStudents + totalStaff - presentToday;

        // Calculate monthly attendance rate for students
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthResult = await makeEtimeRequest({
            Empcode: 'ALL',
            FromDate: formatDate(firstDayOfMonth),
            ToDate: formatDate(today)
        });

        let attendanceRate = 0;
        if (monthResult.success && monthResult.data) {
            // Count unique students who attended this month (with check-in time)
            const monthStudents = new Set();
            monthResult.data.forEach(record => {
                const empCode = normalizeEmpCode(record.Empcode);
                const inTime = record.INTime && record.INTime !== '--:--' && record.INTime !== null;
                if (empCode && inTime && getEmployeeType(empCode) === 'student') {
                    monthStudents.add(empCode); // Now always string
                }
            });

            // Calculate rate (students who attended at least once / total students)
            attendanceRate = totalStudents > 0
                ? Math.round((monthStudents.size / totalStudents) * 100)
                : 0;
        }

        res.json({
            success: true,
            data: {
                totalChildren, // For backward compatibility
                totalStudents,
                totalStaff,
                presentToday,
                presentStudents,
                presentStaff,
                absentToday,
                absentStudents,
                absentStaff,
                attendanceRate
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get recent activity/check-ins (protected route)
app.get('/api/attendance/recent', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const today = new Date();

        const result = await makeEtimeRequest({
            Empcode: 'ALL',
            FromDate: formatDate(today),
            ToDate: formatDate(today)
        });

        if (!result.success) {
            return res.status(result.status || 500).json({
                success: false,
                error: result.error
            });
        }

        const punchData = result.data || [];

        // Get check-ins for employees with valid INTime (Present status)
        const checkIns = punchData
            .filter(record => {
                const empCode = normalizeEmpCode(record.Empcode);
                return empCode && record.Status === 'P' && record.INTime && record.INTime !== '--:--';
            })
            .map(record => ({
                empCode: normalizeEmpCode(record.Empcode), // Always string
                name: record.Name || 'Unknown',
                inTime: record.INTime,
                dateString: record.DateString,
                status: 'Present',
                avatar: (record.Name || '?').charAt(0).toUpperCase()
            }))
            .sort((a, b) => {
                // Sort by date and time (most recent first)
                const dateA = `${a.dateString} ${a.inTime}`;
                const dateB = `${b.dateString} ${b.inTime}`;
                return dateB.localeCompare(dateA);
            })
            .slice(0, limit)
            .map(item => ({
                name: item.name,
                time: `${item.dateString} ${item.inTime}`,
                status: item.status,
                avatar: item.avatar
            }));

        res.json({ success: true, data: checkIns });
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Attendance System Backend Server running on http://127.0.0.1:${PORT}`);
    console.log(`📡 E-Time Office Cloud API: ${E_TIME_API_CONFIG.baseURL}`);
    console.log(`👤 Corporate ID: ${E_TIME_API_CONFIG.corporateId}`);
    console.log(`\n✅ Server is ready to receive requests!\n`);
});
