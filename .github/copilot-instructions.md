# AI Coding Agent Instructions for Biometric Attendance System

## Architecture Overview

This is a **biometric attendance tracking system** for a charitable trust managing children's attendance via fingerprint scanning. The system follows a **proxy architecture**:

```
Fingerprint Device → E-Time Office Cloud API → Node.js Backend → Vanilla JS Frontend
```

**Key Components:**

- **Frontend**: Static HTML/CSS/JS files with Chart.js for visualizations
- **Backend**: Express.js server proxying requests to E-Time Office Cloud API
- **External API**: E-Time Office Cloud handles biometric data storage and retrieval
- **Authentication**: Simple username/password system (admin/staff roles)

## Critical Developer Workflows

### Backend Setup & API Integration

```bash
# Install dependencies
cd backend && npm install

# Configure environment (copy from env.example)
cp .env.example .env
# Edit .env with E-Time credentials:
# E_TIME_USERNAME=your_username
# E_TIME_PASSWORD=your_password

# Start development server
npm run dev  # Uses nodemon for auto-reload
```

### Testing API Integration

```bash
# Test backend health
curl http://localhost:3000/api/health

# Test attendance endpoint
curl http://localhost:3000/api/attendance/today
```

### Frontend Development

- Open `index.html` directly in browser (no build step required)
- Update `api-config.js` to point to backend URL
- Mock data falls back automatically when API unavailable

## Project-Specific Patterns & Conventions

### Data Transformation (E-Time API → Frontend)

The backend transforms E-Time punch data format to match frontend expectations:

```javascript
// E-Time returns: { Empcode, Name, PunchDate, EmpcardNo }
// Frontend expects: { id, name, checkIn, checkOut, status }
function transformAttendanceData(etimeData) {
  // Group punches by employee, determine check-in/out times
  // Status: 'present' (before 8:30), 'late' (after 8:30), 'absent'
}
```

**Key mappings:**

- `Empcode` → `id` and `empCode`
- `PunchDate` (DD/MM/YYYY HH:MM:SS) → `checkIn`/`checkOut` times
- First punch = check-in, last punch = check-out
- Status based on check-in time vs 8:30 AM threshold

### Authentication Pattern

```javascript
// Simple credential check (see script.js)
const validCredentials = {
  admin: "admin123",
  staff: "staff123",
};
```

### API Request Pattern

```javascript
// Always use api-config.js helpers
async function fetchAttendanceData() {
  const response = await fetch(getApiUrl("/attendance/today"));
  const data = await response.json();
  return data.children || []; // Fallback to empty array
}
```

### Date Handling

- **E-Time API format**: `DD/MM/YYYY_HH:mm` (note underscore separator)
- **Frontend display**: `HH:MM AM/PM` format
- **Internal processing**: Standard JavaScript Date objects

### Error Handling

- API failures fall back to mock data silently
- Console logging for debugging (`console.error` for API issues)
- User-friendly error messages in UI

## Integration Points & Dependencies

### E-Time Office Cloud API

- **Endpoint**: `https://api.etimeoffice.com/api/DownloadPunchData`
- **Auth**: Basic Auth with `username:password` (base64 encoded)
- **Parameters**: `Empcode`, `FromDate`, `ToDate`
- **Response**: Array of punch records with employee data

### CORS Configuration

```javascript
// Backend enables CORS for frontend
app.use(cors());
```

### Environment Variables

- `E_TIME_USERNAME` / `E_TIME_PASSWORD`: API credentials
- `PORT`: Server port (default 3000)
- Never commit `.env` files (already in `.gitignore`)

## File Organization Patterns

### Frontend Structure

```
index.html          # Login page
dashboard.html      # Main dashboard
attendance.html     # Records page
script.js           # Shared auth functions
dashboard.js        # Dashboard logic
attendance.js       # Attendance logic
api-config.js       # API configuration
styles.css          # All styling
```

### Backend Structure

```
backend/
├── server.js        # Main Express server
├── package.json     # Dependencies
├── .env            # Environment variables (gitignored)
└── env.example     # Template
```

## Common Development Tasks

### Adding New API Endpoint

1. Add route in `backend/server.js`
2. Update `api-config.js` endpoints object
3. Update frontend JS files to use new endpoint
4. Test with both real API and mock fallback

### Modifying Data Display

1. Update transformation logic in backend
2. Adjust frontend rendering in respective `.js` file
3. Test with sample data from E-Time API

### Adding New Dashboard Widget

1. Update `dashboard.html` structure
2. Add data fetching in `dashboard.js`
3. Style in `styles.css`
4. Update mock data if needed

## Testing & Debugging

### Backend Debugging

- Check console logs for API request/response details
- Use Postman/curl to test endpoints directly
- Verify E-Time credentials in `.env`

### Frontend Debugging

- Browser dev tools for network requests
- Check `api-config.js` baseURL setting
- Mock data appears when API unavailable

### Common Issues

- **CORS errors**: Ensure backend is running and CORS enabled
- **401 Unauthorized**: Check E-Time credentials
- **Data format mismatch**: Update `transformAttendanceData()` function
- **Date parsing errors**: Verify E-Time date format handling

## Deployment Considerations

- Backend requires Node.js hosting (Heroku, AWS, etc.)
- Frontend can be static hosting (GitHub Pages, Netlify)
- Update `api-config.js` baseURL for production
- Set environment variables on server
- Consider HTTPS for production security</content>
  <parameter name="filePath">c:\Christ University\6th Sem\Service Learning\.github\copilot-instructions.md
