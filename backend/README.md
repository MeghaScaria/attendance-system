# Attendance System Backend Server

Backend server that acts as a proxy between your website and E-Time Office Cloud API.

## Architecture

```
Frontend Website → Backend Server (this) → E-Time Office Cloud API
```

## Setup Instructions

### 1. Install Dependencies

Make sure you have Node.js installed (version 14 or higher).

Navigate to the backend directory:

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and add your E-Time Office Cloud credentials:
   ```env
   E_TIME_API_URL=https://api.etimeofficecloud.com/api
   E_TIME_USERNAME=your_actual_username
   E_TIME_PASSWORD=your_actual_password
   PORT=3000
   ```

**Important:** Get the actual API URL, username, and password from E-Time Office Cloud documentation or support.

### 3. Update API Endpoints

Open `server.js` and check the endpoint paths in the `makeEtimeRequest()` calls. You'll need to adjust these based on E-Time Office Cloud's actual API endpoints:

- `/attendance` - for getting attendance data
- `/employees` - for getting employee/child list
- etc.

Refer to E-Time Office Cloud API documentation for exact endpoints.

### 4. Adjust Data Transformation

The `transformAttendanceData()` function in `server.js` transforms E-Time Office Cloud's response format to match what your frontend expects. You'll need to adjust the field mappings based on the actual API response structure.

**To see what the API returns:**
1. Start the server
2. Make a test request
3. Check server console logs
4. Adjust transformation function accordingly

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port you specified in `.env`).

### 6. Update Frontend Configuration

Update `api-config.js` in the root directory to point to your backend server:

```javascript
baseURL: 'http://localhost:3000/api'
```

If deploying to production, change this to your production backend URL.

## API Endpoints

Your backend provides these endpoints:

- `GET /api/health` - Health check
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/range?start=YYYY-MM-DD&end=YYYY-MM-DD` - Get attendance for date range
- `GET /api/attendance/all` - Get all attendance logs
- `GET /api/attendance/employee/:id` - Get employee-wise data
- `GET /api/children` - Get list of all children/employees
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/attendance/recent?limit=10` - Get recent check-ins

## Testing

### Test if server is running:
```bash
curl http://localhost:3000/api/health
```

### Test attendance endpoint:
```bash
curl http://localhost:3000/api/attendance/today
```

### Test with browser:
Open `http://localhost:3000/api/health` in your browser.

## Troubleshooting

### Issue: "Cannot connect to E-Time API"
- Check if API URL is correct in `.env`
- Verify username and password
- Check if your network can reach E-Time Office Cloud
- Check E-Time Office Cloud API documentation for any IP whitelisting requirements

### Issue: "401 Unauthorized"
- Verify username and password in `.env` file
- Check if credentials have expired
- Contact E-Time Office Cloud support

### Issue: "404 Not Found"
- Verify API endpoint paths in `server.js`
- Check E-Time Office Cloud API documentation for correct endpoints
- Some APIs might require organization/device ID in the path

### Issue: "CORS errors in frontend"
- Make sure backend is running
- Check if frontend is pointing to correct backend URL in `api-config.js`
- Backend already has CORS enabled, so this shouldn't happen if configured correctly

### Issue: "Data format doesn't match"
- Check server console logs to see actual API response
- Adjust `transformAttendanceData()` function in `server.js`
- Update field mappings to match actual API response structure

## Next Steps

1. **Get E-Time Office Cloud API Documentation**
   - Request from vendor
   - Identify exact endpoints
   - Understand response format
   - Check authentication requirements

2. **Test API Connection**
   - Use Postman or curl to test endpoints directly
   - Verify authentication works
   - See actual response format

3. **Update Code**
   - Adjust endpoint paths in `server.js`
   - Update data transformation functions
   - Test each endpoint

4. **Deploy**
   - Deploy backend to a server (Heroku, AWS, DigitalOcean, etc.)
   - Update frontend `api-config.js` with production URL
   - Set environment variables on production server

## Security Notes

- Never commit `.env` file to git (already in `.gitignore`)
- Use environment variables for all sensitive data
- Consider adding rate limiting for production
- Add request validation
- Consider adding authentication for your API endpoints (if needed)

## Support

For E-Time Office Cloud API issues:
- Contact E-Time Office Cloud support
- Refer to their API documentation
- Check their API status/status page
