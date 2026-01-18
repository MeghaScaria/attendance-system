# API Integration Setup Guide

## Overview

This website is now configured to work with your vendor's cloud platform API. The biometric device uploads attendance logs to the vendor's cloud, and your website retrieves and displays that data.

## Architecture Flow

```
Biometric Device → Vendor's Cloud Platform (via Wi-Fi/TCP-IP)
                                    ↓
                      Your Website (fetches via API)
                                    ↓
                          Displays on Dashboard/Attendance Pages
```

## Setup Instructions

### Step 1: Configure API Settings

1. Open `api-config.js` file
2. Update the following settings based on your vendor's API documentation:

```javascript
const API_CONFIG = {
    // Replace with your vendor's API base URL
    baseURL: 'https://api.vendor-platform.com/v1',
    
    // Replace with your API key (get from vendor)
    apiKey: 'YOUR_API_KEY_HERE',
    
    // Replace with API secret if required
    apiSecret: 'YOUR_API_SECRET_HERE',
    
    // Replace with your device/organization ID if required
    deviceId: 'YOUR_DEVICE_ID',
    
    // Update endpoints based on vendor's API documentation
    endpoints: {
        todayAttendance: '/attendance/today',
        attendanceRange: '/attendance/range',
        childrenList: '/children',
        childAttendance: '/attendance/child',
        dashboardStats: '/dashboard/stats',
        recentActivity: '/attendance/recent'
    }
};
```

### Step 2: Update API Endpoints

Check your vendor's API documentation and update the endpoints in `api-config.js` to match their actual endpoints. Common variations:

- `/api/v1/attendance`
- `/rest/attendance/get`
- `/attendance/today`
- etc.

### Step 3: Configure Authentication Method

Different vendors use different authentication methods:

**Option A: API Key in Header (Most Common)**
```javascript
headers: {
    'X-API-Key': API_CONFIG.apiKey
}
```

**Option B: Bearer Token**
```javascript
headers: {
    'Authorization': `Bearer ${API_CONFIG.apiKey}`
}
```

**Option C: Query Parameter**
```javascript
// Modify apiRequest function to add ?api_key=YOUR_KEY to URL
```

**Option D: Basic Auth**
```javascript
headers: {
    'Authorization': `Basic ${btoa(API_CONFIG.apiKey + ':' + API_CONFIG.apiSecret)}`
}
```

Update the `getApiHeaders()` function in `api-config.js` accordingly.

### Step 4: Adjust Data Transformation

The API response format may differ from what the website expects. You'll need to adjust the transformation functions:

#### For Dashboard (`dashboard.js`)

Update the `transformApiData()` function to match your vendor's response format:

```javascript
function transformApiData(apiData) {
    return {
        totalChildren: apiData.total_children || apiData.total || 0,
        presentToday: apiData.present_today || apiData.present || 0,
        // ... adjust field names based on API response
    };
}
```

#### For Attendance Page (`attendance.js`)

Update the `transformApiChildData()` function:

```javascript
function transformApiChildData(apiChild) {
    return {
        id: apiChild.id || apiChild.child_id,
        name: apiChild.name || apiChild.child_name,
        // ... adjust field names
    };
}
```

### Step 5: Test API Connection

1. First, test with mock data:
   - In `dashboard.js`, set `const USE_API = false;`
   - In `attendance.js`, set `const USE_API = false;`
   - Verify website works with mock data

2. Then test with API:
   - Set `USE_API = true` in both files
   - Open browser console (F12)
   - Check for API errors
   - Verify data appears correctly

### Step 6: Handle CORS (If Needed)

If you encounter CORS errors, you have a few options:

**Option 1: Vendor should enable CORS**
Contact your vendor to enable CORS for your domain.

**Option 2: Use a backend proxy**
Create a simple backend (Node.js/Python) that:
- Receives requests from your website
- Forwards them to vendor's API
- Returns response to website

**Option 3: Vendor provides JSONP** (if supported)
Use JSONP instead of fetch if vendor supports it.

## Common API Response Formats

Here are common response formats you might encounter:

### Format 1: Simple Array
```json
[
  {
    "id": "CH001",
    "name": "Rahul Kumar",
    "checkInTime": "08:15:00",
    "status": "present"
  }
]
```

### Format 2: Wrapped in Object
```json
{
  "success": true,
  "data": [
    {
      "id": "CH001",
      "name": "Rahul Kumar"
    }
  ]
}
```

### Format 3: Nested Structure
```json
{
  "response": {
    "attendance": [
      {
        "child": {
          "id": "CH001",
          "name": "Rahul Kumar"
        },
        "checkIn": "08:15:00"
      }
    ]
  }
}
```

Adjust the data extraction in `fetchAttendanceData()` and `fetchDashboardData()` functions accordingly.

## Testing Checklist

- [ ] API credentials configured correctly
- [ ] API endpoints match vendor's documentation
- [ ] Authentication method works
- [ ] Dashboard loads data from API
- [ ] Attendance page shows correct data
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Date filters work correctly
- [ ] Error handling works (fallback to mock data if API fails)
- [ ] No CORS errors in console

## Troubleshooting

### Issue: "API Error: 401 Unauthorized"
- Check if API key is correct
- Verify authentication method matches vendor's requirements
- Ensure API key hasn't expired

### Issue: "API Error: 404 Not Found"
- Verify endpoint URLs are correct
- Check if you need to include device ID or organization ID in the URL
- Review vendor's API documentation for correct endpoint structure

### Issue: "CORS policy blocked"
- Contact vendor to enable CORS for your domain
- Or set up a backend proxy server

### Issue: Data not displaying correctly
- Check browser console for errors
- Verify data transformation functions match API response format
- Use `console.log()` to inspect API responses

### Issue: Empty data or wrong format
- Inspect API response in browser Network tab
- Adjust transformation functions to match actual response structure
- Check if vendor uses different field names

## Getting Help

1. Check vendor's API documentation
2. Test API endpoints using tools like Postman or curl
3. Contact vendor support with specific error messages
4. Check browser console (F12) for detailed error messages

## Important Notes

- **Security**: Never commit API keys to public repositories
- **Error Handling**: The website will fallback to mock data if API fails (for testing)
- **Performance**: Consider caching API responses if updates aren't needed in real-time
- **Rate Limiting**: Check vendor's API rate limits to avoid exceeding them
