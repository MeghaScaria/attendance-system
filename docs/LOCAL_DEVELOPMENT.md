# Local Development Guide

This guide will help you test your changes locally **before** deploying to Render, so you can see updates instantly without waiting for deployment.

## Quick Start (3 Steps)

### Step 1: Install Dependencies (One-time setup)

Open PowerShell/Terminal in your project folder and run:

```bash
cd backend
npm install
```

This installs all required packages (express, axios, etc.)

### Step 2: Start the Local Server

In the same terminal, run:

```bash
node server.js
```

You should see:
```
✓ User accounts initialized
✓ Employee types loaded: 25 entries
Server running on http://localhost:3000
```

### Step 3: Open Your Website

1. Open your browser
2. Go to: `http://localhost:3000`
3. Log in with:
   - Username: `admin`
   - Password: `admin123`

**That's it!** Your website is now running locally. Any changes you make will be visible immediately after refreshing the page.

---

## How It Works

### Local vs Production

**Local Development:**
- Backend runs on: `http://localhost:3000`
- Frontend automatically uses local backend
- Changes appear instantly (just refresh browser)
- No deployment needed

**Production (Render):**
- Backend runs on: `https://praja-kirana-seva-attendance-system.onrender.com`
- Changes require: Edit → Commit → Push → Wait for Render to deploy (2-5 minutes)

### Auto-Deployment on Render

If your Render service is connected to GitHub:
- ✅ **Auto-Deploy is ON**: Every time you push to GitHub, Render automatically deploys
- ✅ **No manual steps needed**: Just `git push` and wait 2-5 minutes
- ✅ **Deployment status**: Check your Render dashboard to see deployment progress

---

## Testing Workflow

### Recommended Workflow:

1. **Make changes** to your code
2. **Test locally**:
   ```bash
   # Terminal 1: Start backend
   cd backend
   node server.js
   
   # Browser: Open http://localhost:3000
   # Test your changes
   ```
3. **If it works locally**, commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **Wait for Render** to auto-deploy (check Render dashboard)
5. **Test on production** URL

---

## Configuration

### Frontend Configuration

The frontend automatically detects if you're running locally:

- **Local**: Uses `http://localhost:3000/api`
- **Production**: Uses `https://praja-kirana-seva-attendance-system.onrender.com/api`

**File**: `public/api-config.js`

```javascript
// This automatically works for both local and production
const API_CONFIG = {
    baseURL: window.location.origin + '/api',  // Uses current domain
    // ...
};
```

### Backend Configuration

**File**: `backend/server.js`

- Port: `3000` (or from `PORT` environment variable)
- Serves frontend from: `public/` folder
- Serves data from: `data/` folder

---

## Common Tasks

### 1. Test Directory Page Changes

```bash
# Terminal: Start server
cd backend
node server.js

# Browser: http://localhost:3000/directory.html
# Make changes to public/directory.js
# Refresh browser → See changes instantly!
```

### 2. Test Attendance Page Changes

```bash
# Terminal: Start server
cd backend
node server.js

# Browser: http://localhost:3000/attendance.html
# Make changes to public/attendance.js
# Refresh browser → See changes instantly!
```

### 3. Test Backend API Changes

```bash
# Terminal: Start server
cd backend
node server.js

# Make changes to backend/server.js
# Restart server: Press Ctrl+C, then run `node server.js` again
# Test in browser → See changes!
```

### 4. Update Employee Data

```bash
# Edit data/employee-names.json or data/employee-types.json
# Refresh browser → Changes appear immediately!
# No server restart needed for data files
```

---

## Troubleshooting

### Problem: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install
```

### Problem: "Port 3000 already in use"

**Solution:**
1. Find what's using port 3000:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3000
   
   # Kill the process (replace PID with actual number)
   taskkill /PID <PID> /F
   ```
2. Or change the port in `backend/server.js`:
   ```javascript
   const PORT = process.env.PORT || 3001;  // Use 3001 instead
   ```
3. Then access: `http://localhost:3001`

### Problem: "CORS error" or "Failed to fetch"

**Solution:**
- Make sure backend server is running (`node server.js`)
- Check that you're accessing `http://localhost:3000` (not `file://`)
- Clear browser cache: `Ctrl + Shift + R`

### Problem: Changes not appearing

**Solution:**
1. **Hard refresh**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. **Clear cache**: Open DevTools → Network tab → Check "Disable cache"
3. **Check file saved**: Make sure you saved the file in your editor
4. **Restart server**: If you changed `backend/server.js`, restart the server

---

## Quick Reference Commands

### Start Development Server
```bash
cd backend
node server.js
```

### Install Dependencies (if adding new packages)
```bash
cd backend
npm install <package-name>
```

### Check if Server is Running
Open browser: `http://localhost:3000`

### Stop Server
Press `Ctrl + C` in the terminal

---

## Tips for Faster Development

### 1. Use Two Terminals

**Terminal 1** (Backend):
```bash
cd backend
node server.js
# Keep this running
```

**Terminal 2** (Git commands):
```bash
# Make changes, then:
git add .
git commit -m "Your message"
git push
```

### 2. Use Browser DevTools

- **Console**: See errors and debug logs
- **Network**: Check API requests
- **Elements**: Inspect HTML/CSS
- **Disable cache**: Check "Disable cache" in Network tab for instant updates

### 3. Auto-Refresh (Optional)

Install a browser extension like "Live Server" or use VS Code's "Live Preview" extension for automatic page refresh when files change.

---

## Environment Variables

If you need to use different settings locally vs production:

**Create**: `backend/.env` (already exists)
```env
PORT=3000
JWT_SECRET=your-secret-key-here
ETIME_USERNAME=your-username
ETIME_PASSWORD=your-password
```

**Note**: `.env` file is in `.gitignore`, so it won't be pushed to GitHub. Each environment (local, Render) has its own `.env` file.

---

## Summary

✅ **Local Development**: Fast, instant feedback, no deployment needed  
✅ **Production (Render)**: Auto-deploys from GitHub, accessible from anywhere  
✅ **Best Practice**: Test locally first, then push to production  

**Time Saved**: Instead of waiting 2-5 minutes for each change, you see results instantly!

---

## Next Steps

1. Try it now: Run `cd backend && node server.js`
2. Open `http://localhost:3000` in your browser
3. Make a small change (e.g., edit `public/directory.js`)
4. Refresh browser → See your change instantly!

No more waiting for deployments! 🚀
