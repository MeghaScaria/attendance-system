# 🚀 Deployment Guide - Render.com (Free & Easy)

This guide will help you deploy your Attendance System website for FREE on Render.com. Follow the steps carefully!

## 📋 Prerequisites

1. **GitHub Account** (free) - [Sign up here](https://github.com/signup)
2. **Render.com Account** (free) - [Sign up here](https://render.com)
3. **Your code ready** (which you already have!)

---

## 📝 Step 1: Prepare Your Code for Deployment

### 1.1 Update API Configuration for Production

**Before deploying**, you need to update `api-config.js` to point to your deployed backend URL.

Open `api-config.js` and find this line:

```javascript
baseURL: 'http://localhost:3000/api',  // Change this to your backend server URL
```

**Keep this for now** - we'll update it after deployment. Just make a note that it needs to change!

---

## 📦 Step 2: Push Your Code to GitHub

### 2.1 Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button in the top right → **"New repository"**
3. Name it something like `attendance-system` or `orphanage-attendance`
4. Make it **Private** (recommended) or **Public**
5. **DO NOT** check "Add a README file" (we already have code)
6. Click **"Create repository"**

### 2.2 Upload Your Code to GitHub

**Option A: Using GitHub Desktop (Easiest for beginners)**

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in with your GitHub account
3. In GitHub Desktop:
   - Click **"File"** → **"Add Local Repository"**
   - Click **"Choose"** and select your project folder
   - Click **"Publish repository"** (top right)
   - Select your GitHub account and repository name
   - Click **"Publish Repository"**

**Option B: Using Command Line (If you have Git installed)**

Open terminal/command prompt in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

## 🎯 Step 3: Deploy Backend to Render.com

### 3.1 Create a New Web Service

1. Go to [Render.com Dashboard](https://dashboard.render.com)
2. Click **"New +"** button → **"Web Service"**
3. Connect your GitHub account if you haven't already
4. Select your repository (the one you just created)
5. Fill in the details:

   - **Name**: `attendance-system-backend` (or any name you like)
   - **Region**: Choose closest to you (e.g., "Oregon (US West)")
   - **Branch**: `main` (or `master` if that's your branch)
   - **Root Directory**: `backend` ⚠️ **IMPORTANT!** Your backend code is in the `backend` folder
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (select this!)

6. Click **"Advanced"** and add **Environment Variables**:

   ```
   PORT = 3000
   E_TIME_API_URL = https://api.etimeoffice.com/api
   E_TIME_CORPORATE_ID = PrajaKiranaSeva
   E_TIME_USERNAME = PrajaKiranaSeva
   E_TIME_PASSWORD = PrajaKS@123
   JWT_SECRET = your-super-secret-random-string-change-this-123456
   ```

   ⚠️ **Important**: 
   - Change `JWT_SECRET` to a random string (you can use [this generator](https://www.random.org/strings/))
   - Click **"Add Environment Variable"** for each one
   - Make sure there are no spaces around the `=` sign

7. Click **"Create Web Service"**

### 3.2 Wait for Deployment

- Render will automatically start building your backend
- This takes 2-5 minutes
- You'll see logs in real-time
- Wait until you see: **"Your service is live"** ✅

### 3.3 Copy Your Backend URL

Once deployed, you'll see a URL like:
```
https://attendance-system-backend-xxxx.onrender.com
```

**Copy this URL!** You'll need it for the frontend.

---

## 🌐 Step 4: Deploy Frontend to Render.com

### 4.1 Update Frontend API Configuration

**Before deploying frontend**, update `api-config.js`:

1. Open `api-config.js` in your code editor
2. Find this line:
   ```javascript
   baseURL: 'http://localhost:3000/api',
   ```
3. Replace it with your Render backend URL (add `/api` at the end):
   ```javascript
   baseURL: 'https://attendance-system-backend-xxxx.onrender.com/api',
   ```
   Replace `attendance-system-backend-xxxx.onrender.com` with your actual backend URL!

4. **Save the file** and commit changes to GitHub:
   ```bash
   git add api-config.js
   git commit -m "Update API URL for production"
   git push
   ```

### 4.2 Deploy Frontend as Static Site

Render can host your frontend HTML files for free as a **Static Site**.

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Select your repository again
4. Fill in the details:

   - **Name**: `attendance-system-frontend`
   - **Branch**: `main`
   - **Root Directory**: **Leave empty** (your HTML files are in the root)
   - **Build Command**: **Leave empty** (no build needed for plain HTML/JS)
   - **Publish Directory**: **Leave empty** (files are in root)

5. Click **"Create Static Site"**

### 4.3 Get Your Website URL

Once deployed, you'll get a URL like:
```
https://attendance-system-frontend.onrender.com
```

🎉 **Your website is now live!** Share this URL with the principal!

---

## ✅ Step 5: Test Your Deployed Website

1. Open your frontend URL in a browser
2. Try logging in with:
   - Username: `admin`
   - Password: `admin123`
3. If it works, you're all set! ✅

---

## 🔧 Troubleshooting

### Problem: Backend deployment fails

**Solution:**
- Check that `Root Directory` is set to `backend`
- Verify all environment variables are set correctly
- Check the build logs for errors

### Problem: Frontend can't connect to backend

**Solution:**
- Make sure `api-config.js` has the correct backend URL (with `/api` at the end)
- Check that backend URL starts with `https://` (not `http://`)
- Verify backend is running (check Render dashboard - should show "Live")

### Problem: "CORS error" in browser console

**Solution:**
- Backend already has CORS enabled, but if you still see errors:
- Make sure backend URL in `api-config.js` matches exactly (no trailing slash except `/api`)

### Problem: Login works locally but not on deployed site

**Solution:**
- Clear browser cache
- Check that you pushed the updated `api-config.js` to GitHub
- Verify backend URL is correct

---

## 📝 Important Notes

1. **Free Tier Limits:**
   - Render free tier may spin down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds (it's waking up)
   - After that, it's fast! This is normal for free hosting.

2. **Upgrading (Optional):**
   - If you need always-on service, Render has paid plans ($7/month)
   - For a nonprofit, free tier is usually fine!

3. **Changing Passwords:**
   - To change login passwords, you need to update the backend code
   - Edit `backend/server.js` → `initializeUsers()` function
   - Change the password, push to GitHub, and Render will redeploy automatically

---

## 🎓 Next Steps

1. ✅ Share the website URL with the principal
2. ✅ Test it from different devices
3. ✅ Bookmark the Render dashboard for easy access
4. ✅ Keep your GitHub repository updated

---

## 📞 Need Help?

If you get stuck:
1. Check the Render build logs (they show detailed errors)
2. Check browser console (F12 → Console tab) for frontend errors
3. Make sure all steps were followed correctly

**Good luck with your deployment! 🚀**
