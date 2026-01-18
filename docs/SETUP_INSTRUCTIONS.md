# Complete Setup Instructions - E-Time Office Cloud Integration

## Architecture Overview

```
Fingerprint Device → E-Time Office Cloud → Your Backend Server → Your Website
```

## Step-by-Step Setup

### Part 1: Backend Server Setup

#### 1.1 Install Node.js
- Download and install Node.js from https://nodejs.org/ (version 14 or higher)
- Verify installation: Open terminal/command prompt and run `node --version`

#### 1.2 Install Backend Dependencies

Open terminal/command prompt in your project directory:

```bash
cd "c:\Christ University\6th Sem\Service Learning\backend"
npm install
```

This will install:
- Express (web server framework)
- Axios (for API requests)
- CORS (to allow frontend to access backend)
- dotenv (for environment variables)

#### 1.3 Configure Environment Variables

1. In the `backend` folder, create a file named `.env`
2. Copy the contents from `env.example` or create it with:

```env
E_TIME_API_URL=https://api.etimeofficecloud.com/api
E_TIME_USERNAME=your_etime_username
E_TIME_PASSWORD=your_etime_password
PORT=3000
```

3. Replace with your actual E-Time Office Cloud credentials
   - Get these from E-Time Office Cloud support or documentation
   - Contact them for API URL, username, and password

#### 1.4 Update API Endpoints

Open `backend/server.js` and find the `makeEtimeRequest()` calls. You'll need to update the endpoint paths based on E-Time Office Cloud's actual API endpoints.

For example, if E-Time uses:
- `/api/v1/attendance` instead of `/attendance`
- `/api/v1/employees` instead of `/employees`

Update these in the server.js file.

**Note:** You'll need E-Time Office Cloud API documentation to know the exact endpoints.

#### 1.5 Adjust Data Transformation

The `transformAttendanceData()` function in `server.js` needs to match E-Time's actual response format. You'll need to:

1. Start the server (see next step)
2. Test an API call
3. Check console logs to see the actual response
4. Update field mappings in `transformAttendanceData()` function

#### 1.6 Start Backend Server

```bash
cd backend
npm start
```

Or for development (auto-reload on changes):
```bash
npm run dev
```

You should see:
```
🚀 Attendance System Backend Server running on http://localhost:3000
📡 E-Time Office Cloud API: https://api.etimeofficecloud.com/api
👤 Username: your_username
✅ Server is ready to receive requests!
```

#### 1.7 Test Backend

Open browser and go to: `http://localhost:3000/api/health`

You should see: `{"status":"ok","message":"Server is running"}`

---

### Part 2: Frontend Configuration

#### 2.1 Update API Configuration

Open `api-config.js` in the root directory. It should already be configured to point to your backend:

```javascript
baseURL: 'http://localhost:3000/api'
```

If your backend is running on a different port or URL, update this.

#### 2.2 Enable API Mode

In both `dashboard.js` and `attendance.js`, make sure:

```javascript
const USE_API = true;  // Should be true
```

#### 2.3 Test Frontend

1. Make sure backend server is running (Step 1.6)
2. Open `index.html` in your browser
3. Login with: `admin` / `admin123`
4. Check if data loads from API (check browser console F12 for errors)

---

## Getting E-Time Office Cloud API Details

You'll need to contact E-Time Office Cloud to get:

1. **API Base URL**
   - Usually something like: `https://api.etimeofficecloud.com` or `https://cloud.etimeoffice.com/api`
   
2. **Authentication Credentials**
   - Username
   - Password
   - May need organization ID or device ID

3. **API Endpoints Documentation**
   - Exact endpoint paths (e.g., `/api/v1/attendance`)
   - Request parameters
   - Response format
   - Any required headers

4. **API Response Format**
   - JSON structure
   - Field names
   - Data types
   - Date/time formats

---

## Common API Endpoint Patterns

E-Time Office Cloud might use endpoints like:

```
GET /api/attendance?date=2024-01-15
GET /api/attendance?start_date=2024-01-01&end_date=2024-01-31
GET /api/employees
GET /api/employee/{id}/attendance
```

You'll need to update `server.js` to match their actual endpoints.

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Health check endpoint works (`/api/health`)
- [ ] Can connect to E-Time Office Cloud API (check server logs)
- [ ] Frontend can connect to backend (check browser console)
- [ ] Dashboard loads data
- [ ] Attendance page shows data
- [ ] Data format matches what frontend expects

---

## Troubleshooting

### Backend won't start
- Check if Node.js is installed: `node --version`
- Check if dependencies installed: `npm install` in backend folder
- Check if port 3000 is already in use

### Can't connect to E-Time API
- Verify API URL in `.env` file
- Check username and password
- Verify network connection
- Check if IP needs to be whitelisted (ask E-Time support)

### Frontend shows errors
- Make sure backend is running
- Check browser console (F12) for error messages
- Verify `api-config.js` has correct backend URL
- Check CORS settings (backend should handle this automatically)

### Data format issues
- Check server console logs to see actual API response
- Update `transformAttendanceData()` function in `server.js`
- Match field names from API response to frontend expectations

---

## Next Steps After Setup

1. **Get API Documentation** from E-Time Office Cloud
2. **Update Endpoints** in `server.js` to match their API
3. **Test Each Endpoint** individually
4. **Adjust Data Transformation** based on actual responses
5. **Test Frontend** with real data
6. **Deploy** when everything works

---

## Support Resources

- E-Time Office Cloud Support - for API questions
- Backend logs - check console for detailed errors
- Browser console (F12) - check for frontend errors
- Node.js documentation - if you need help with Node.js

---

## Quick Start Commands

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file (copy from env.example and fill in credentials)

# 3. Start backend server
npm start

# 4. Open frontend
# Open index.html in browser (backend should be running)
```

Good luck with your setup! 🚀
