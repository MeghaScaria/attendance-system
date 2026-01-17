# 🚀 Quick Start Guide

## What's Been Done ✅

1. ✅ **Backend Authentication** - JWT-based authentication system
2. ✅ **API Integration** - Using `DownloadInOutPunchData` endpoint
3. ✅ **Frontend Integration** - Frontend now uses backend authentication
4. ✅ **Deployment Guide** - Step-by-step guide for Render.com (FREE hosting)

---

## 🔧 Testing Locally (Before Deployment)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- Express (web server)
- JWT (authentication)
- bcryptjs (password hashing)
- axios (API calls)
- And other dependencies

### Step 2: Create Environment File

Copy `backend/env.example` to `backend/.env`:

```bash
# On Windows PowerShell
Copy-Item backend\env.example backend\.env

# On Mac/Linux
cp backend/env.example backend/.env
```

Edit `backend/.env` and make sure all values are correct (they should be already set up).

### Step 3: Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Attendance System Backend Server running on http://127.0.0.1:3000
```

### Step 4: Test Frontend

1. Open `index.html` in your web browser
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`

If everything works, you're ready to deploy! 🎉

---

## 🌐 Deployment (See Full Guide)

See **`DEPLOYMENT_GUIDE.md`** for complete step-by-step instructions!

**Quick Summary:**
1. Push code to GitHub
2. Deploy backend to Render.com
3. Update `api-config.js` with backend URL
4. Deploy frontend to Render.com
5. Done! ✅

---

## 🔐 Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

Or:

- **Username**: `staff`
- **Password**: `staff123`

⚠️ **Important**: Change these passwords before deploying to production! Edit `backend/server.js` → `initializeUsers()` function.

---

## 📁 Project Structure

```
.
├── backend/              # Backend server (Node.js)
│   ├── server.js        # Main server file
│   ├── package.json     # Dependencies
│   └── .env            # Environment variables (create from env.example)
├── index.html           # Login page
├── dashboard.html       # Dashboard page
├── attendance.html      # Attendance records page
├── script.js           # Frontend authentication
├── api-config.js       # API configuration (update with backend URL)
└── DEPLOYMENT_GUIDE.md # Full deployment instructions
```

---

## 🆘 Troubleshooting

### Backend won't start
- Make sure you're in the `backend` folder
- Run `npm install` first
- Check if port 3000 is already in use

### Login doesn't work locally
- Make sure backend server is running
- Check browser console (F12) for errors
- Verify backend URL in `api-config.js` is `http://localhost:3000/api`

### Frontend can't connect to backend
- Check that backend is running
- Verify `api-config.js` has correct URL
- Check browser console for errors

---

## 📚 Next Steps

1. Test everything locally
2. Follow `DEPLOYMENT_GUIDE.md` to deploy
3. Share the website URL with the principal
4. Celebrate! 🎉

Good luck! 🚀
