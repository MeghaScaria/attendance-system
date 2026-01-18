# 📁 File Usage Guide - What's Used and What's Not

This document explains which files are **ACTUALLY USED** in your project and which ones can be **SAFELY DELETED**.

---

## ✅ **ESSENTIAL FILES (DO NOT DELETE)**

### **Frontend Core Files** (Required for website to work)
- ✅ `index.html` - Login page
- ✅ `dashboard.html` - Main dashboard page
- ✅ `attendance.html` - Attendance records page
- ✅ `absentees.html` - Absentees page
- ✅ `directory.html` - Directory page
- ✅ `styles.css` - All styling for the website
- ✅ `script.js` - Authentication and shared functions
- ✅ `dashboard.js` - Dashboard functionality
- ✅ `attendance.js` - Attendance page functionality
- ✅ `absentees.js` - Absentees page functionality
- ✅ `directory.js` - Directory page functionality
- ✅ `api-config.js` - API configuration (connects to backend)

### **Backend Core Files** (Required for server to work)
- ✅ `backend/server.js` - Main backend server code
- ✅ `backend/package.json` - Backend dependencies
- ✅ `backend/package-lock.json` - Dependency lock file
- ✅ `backend/env.example` - Example environment variables (reference)

### **Configuration Files** (Required for correct data)
- ✅ `employee-types.json` - Maps employee codes to student/teacher
- ✅ `employee-names.json` - Maps employee codes to correct names

### **Git Files** (Required for version control)
- ✅ `.gitignore` - Tells Git which files to ignore
- ✅ `backend/.gitignore` - Backend-specific Git ignore

---

## 📚 **DOCUMENTATION FILES** (Keep for reference, but not required to run)

These are helpful guides but the website works without them:

- 📖 `README.md` - Project overview
- 📖 `DEPLOYMENT_GUIDE.md` - How to deploy to Render.com
- 📖 `BEGINNER_GUIDE.md` - Complete beginner's guide
- 📖 `QUICK_START.md` - Quick setup instructions
- 📖 `GITHUB_SETUP.md` - GitHub setup guide
- 📖 `EMPLOYEE_TYPES_SETUP.md` - How to update employee types
- 📖 `TEST_BACKEND.md` - Testing backend guide
- 📖 `TROUBLESHOOTING_CONNECTION.md` - Troubleshooting guide
- 📖 `API_SETUP_GUIDE.md` - API setup guide
- 📖 `SETUP_INSTRUCTIONS.md` - Setup instructions
- 📖 `backend/README.md` - Backend documentation
- 📖 `.github/copilot-instructions.md` - GitHub Copilot instructions

**Recommendation**: Keep these if you want reference documentation. Delete if you want a cleaner folder.

---

## 🗑️ **UNUSED/OBSOLETE FILES** (SAFE TO DELETE)

These files are **NOT USED** by your current project:

### **Old/Unused Code**
- ❌ `biometric-attendance-system/` - **ENTIRE FOLDER** - Old project structure, not used
  - `biometric-attendance-system/Backend/` - Old backend code
  - `biometric-attendance-system/Frontend/` - Old frontend code
- ❌ `Biometric_system.c` - C code file, not used in web project

### **Test/Reference Files**
- ❌ `API1.xls` - Excel file with API data (reference only)
- ❌ `API1 - Copy.csv` - CSV copy of API data (reference only)
- ❌ `APIs and their responses.txt` - Text file with API info (reference only)
- ❌ `student_staff_details.xlsx` - Excel with student/staff data (already converted to JSON)
- ❌ `Students and Staff Details.txt` - Text version of student/staff data

### **Credential/Password Files** (⚠️ SECURITY RISK - DELETE THESE!)
- ❌ `CREDENTIALS.txt` - Contains sensitive credentials (should be deleted!)
- ❌ `JWT SECRET.txt` - Contains JWT secret (should be deleted!)
- ❌ `Password.docx` - Password document (should be deleted!)

### **Development/Helper Files**
- ❌ `push-to-github.ps1` - PowerShell script (optional helper, not required)
- ❌ `Prompt.txt` - Development notes (not needed)
- ❌ `.github/copilot-instructions.md` - GitHub Copilot config (optional)

---

## 📊 **Summary**

### **Files You MUST Keep** (20 files)
- 5 HTML files
- 5 JavaScript files
- 1 CSS file
- 1 API config file
- 2 JSON data files
- 1 backend server file
- 2 backend package files
- 1 backend env example
- 2 .gitignore files

### **Files You CAN Delete** (15+ files)
- Old `biometric-attendance-system/` folder (entire folder)
- `Biometric_system.c`
- All `.xls`, `.csv`, `.txt` reference files
- All credential/password files (⚠️ DELETE FOR SECURITY!)
- Helper scripts (optional)

### **Documentation Files** (Your choice)
- Keep if you want reference guides
- Delete if you want a cleaner folder

---

## 🧹 **Recommended Cleanup Steps**

1. **DELETE SECURITY RISKS FIRST:**
   ```bash
   # Delete credential files (IMPORTANT!)
   CREDENTIALS.txt
   JWT SECRET.txt
   Password.docx
   ```

2. **DELETE OLD CODE:**
   ```bash
   # Delete entire old project folder
   biometric-attendance-system/ (entire folder)
   Biometric_system.c
   ```

3. **DELETE REFERENCE FILES:**
   ```bash
   # These are just for reference, data is already in JSON
   API1.xls
   API1 - Copy.csv
   APIs and their responses.txt
   student_staff_details.xlsx
   Students and Staff Details.txt
   ```

4. **OPTIONAL - Delete Documentation:**
   - Keep if you want guides
   - Delete if you want minimal folder

5. **OPTIONAL - Delete Helper Scripts:**
   ```bash
   push-to-github.ps1
   Prompt.txt
   ```

---

## ✅ **After Cleanup, Your Folder Should Have:**

```
Service Learning/
├── index.html
├── dashboard.html
├── attendance.html
├── absentees.html
├── directory.html
├── styles.css
├── script.js
├── dashboard.js
├── attendance.js
├── absentees.js
├── directory.js
├── api-config.js
├── employee-types.json
├── employee-names.json
├── .gitignore
├── README.md (optional)
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── env.example
│   └── .gitignore
└── (optional documentation files)
```

**Total: ~15-20 essential files** (vs current ~40+ files)

---

## ⚠️ **IMPORTANT WARNINGS**

1. **NEVER DELETE:**
   - Any `.html`, `.js`, `.css` files in root
   - `api-config.js`
   - `employee-types.json` or `employee-names.json`
   - `backend/` folder contents

2. **DELETE IMMEDIATELY:**
   - Files with passwords/credentials (security risk!)

3. **BACKUP FIRST:**
   - If unsure about a file, move it to a backup folder first
   - You can always restore it from Git if needed

---

## 🎯 **Quick Cleanup Command** (PowerShell)

If you want to delete the recommended files:

```powershell
# Delete credential files (SECURITY!)
Remove-Item "CREDENTIALS.txt" -ErrorAction SilentlyContinue
Remove-Item "JWT SECRET.txt" -ErrorAction SilentlyContinue
Remove-Item "Password.docx" -ErrorAction SilentlyContinue

# Delete old project folder
Remove-Item "biometric-attendance-system" -Recurse -ErrorAction SilentlyContinue

# Delete old code file
Remove-Item "Biometric_system.c" -ErrorAction SilentlyContinue

# Delete reference files
Remove-Item "API1.xls" -ErrorAction SilentlyContinue
Remove-Item "API1 - Copy.csv" -ErrorAction SilentlyContinue
Remove-Item "APIs and their responses.txt" -ErrorAction SilentlyContinue
Remove-Item "student_staff_details.xlsx" -ErrorAction SilentlyContinue
Remove-Item "Students and Staff Details.txt" -ErrorAction SilentlyContinue

# Optional: Delete helper scripts
Remove-Item "push-to-github.ps1" -ErrorAction SilentlyContinue
Remove-Item "Prompt.txt" -ErrorAction SilentlyContinue
```

**Note**: Run these commands carefully. Make sure you have a Git backup first!
