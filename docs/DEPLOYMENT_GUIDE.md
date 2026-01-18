# 🚀 Deployment Guide - Render.com (Free & Easy)

This guide will help you deploy your Attendance System website for FREE on Render.com. Follow the steps carefully!

> **📚 New to all this?** Read `BEGINNER_GUIDE.md` first! It explains how everything works from the ground up.

## 📋 Prerequisites

1. **GitHub Account** (free) - [Sign up here](https://github.com/signup)
   - ✅ **Already done!** Your code is at: https://github.com/MeghaScaria/attendance-system
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

> **✅ Already Done!** Your code is already on GitHub at: https://github.com/MeghaScaria/attendance-system
> 
> **What happened**: We already initialized Git, committed your files, and pushed to GitHub. You can skip this step!

**If you need to push updates later:**
```bash
git add .
git commit -m "Your update message"
git push
```

**Understanding what this does:**
- `git add .` = Stage all changes (prepare them to be saved)
- `git commit` = Save changes with a message (like saving a file)
- `git push` = Upload changes to GitHub (like uploading to cloud storage)

---

## 🎯 Step 3: Deploy Backend to Render.com

### 3.1 Create a New Web Service

**What we're doing**: We're telling Render.com to create a server that runs your backend code.

1. Go to [Render.com Dashboard](https://dashboard.render.com)
2. Click **"New +"** button

   **You'll see several options. Here's what each means:**
   
   - **🌐 Web Service** ← **SELECT THIS ONE!** ✅
     - **What it is**: A server that runs your backend code (Node.js, Python, etc.)
     - **When to use**: For your backend server (needs to run continuously)
     - **Why**: Your backend needs to listen for requests and process them
   
   - **📄 Static Site** 
     - **What it is**: Just serves HTML/CSS/JS files (no server code)
     - **When to use**: For your frontend (we'll use this in Step 4)
     - **Why**: Frontend is just files, doesn't need a running server
   
   - **🔒 Private Service**
     - **What it is**: Web service but not accessible from internet
     - **When to use**: Internal services only (not for your project)
     - **Why**: Your backend needs to be accessible from frontend
   
   - **🐳 Background Worker**
     - **What it is**: Runs code in background (no web interface)
     - **When to use**: Scheduled tasks, processing jobs (not for your project)
   
   - **📦 PostgreSQL / Redis**
     - **What it is**: Database services
     - **When to use**: If you need a database (not needed for your project)

3. Click **"Web Service"** ✅
   - **What is a Web Service?** = A server that runs your backend code and responds to requests
3. Connect your GitHub account if you haven't already
   - **Why?** = So Render can automatically get your code from GitHub
4. Select your repository: `MeghaScaria/attendance-system`
   - **What this does**: Tells Render which code to use
5. Fill in the details:

   - **Name**: `attendance-system-backend` (or any name you like)
     - *This is just a label for your service*
   
   - **Region**: Choose closest to you (e.g., "Oregon (US West)")
     - *Closer region = Faster response times*
   
   - **Branch**: `main`
     - *Which branch of your GitHub repo to use (we use `main`)*
   
   - **Root Directory**: `backend` ⚠️ **IMPORTANT!** 
     - *Tells Render where your backend code is located*
     - *Your backend files are in the `backend/` folder, not the root*
   
   - **Runtime**: `Node`
     - *What language/framework to use (Node.js for JavaScript)*
   
   - **Build Command**: `npm install`
     - *What to run before starting (installs all dependencies)*
     - *This reads `package.json` and downloads all required packages*
   
   - **Start Command**: `npm start`
     - *What command starts your server*
     - *This runs `node server.js` (defined in package.json)*
   
   - **Plan**: **Free** (select this!)
     - *Free tier is perfect for your project!*

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

**What's happening behind the scenes:**

1. **Render creates a virtual server** (like a computer in the cloud)
2. **Downloads your code** from GitHub
3. **Runs `npm install`**:
   - Reads `backend/package.json`
   - Downloads all dependencies (express, jwt, bcrypt, etc.)
   - Installs them in `node_modules/`
4. **Sets environment variables** (the ones you just added)
5. **Runs `npm start`**:
   - Starts `server.js`
   - Server begins listening for requests
6. **Render assigns a public URL** (like `https://attendance-backend-xxxx.onrender.com`)

**What you'll see:**
- Build logs scrolling in real-time
- Progress indicators
- This takes **2-5 minutes** (be patient!)
- Wait until you see: **"Your service is live"** ✅

**If you see errors:**
- Check the logs (they show what went wrong)
- Common issues: Wrong root directory, missing environment variables

### 3.3 Copy Your Backend URL

Once deployed, you'll see a URL like:
```
https://attendance-system-backend-xxxx.onrender.com
```

**Copy this URL!** You'll need it for the frontend.

---

## 🌐 Step 4: Deploy Frontend to Render.com

### 4.1 Update Frontend API Configuration

**Why do we need to do this?**

**Currently**, `api-config.js` says:
```javascript
baseURL: 'http://localhost:3000/api'
```
This means: "Connect to backend on my local computer"

**After backend deployment**, we need:
```javascript
baseURL: 'https://your-backend.onrender.com/api'
```
This means: "Connect to backend on Render.com"

**Steps:**

1. **Copy your backend URL** from Render dashboard
   - It looks like: `https://attendance-system-backend-xxxx.onrender.com`
   - Copy the ENTIRE URL (including `https://`)

2. **Open `api-config.js`** in your code editor

3. **Find this line** (around line 9):
   ```javascript
   baseURL: 'http://localhost:3000/api',
   ```

4. **Replace it** with your Render backend URL (add `/api` at the end):
   ```javascript
   baseURL: 'https://attendance-system-backend-xxxx.onrender.com/api',
   ```
   ⚠️ **Important**: 
   - Replace `attendance-system-backend-xxxx.onrender.com` with YOUR actual backend URL
   - Keep `/api` at the end
   - Use `https://` (not `http://`)

5. **Save the file**

6. **Push changes to GitHub**:
   ```bash
   git add api-config.js
   git commit -m "Update API URL for production"
   git push
   ```
   
   **What this does:**
   - `git add` = Stage the file (prepare to save)
   - `git commit` = Save with a message
   - `git push` = Upload to GitHub (Render will see the update)

### 4.2 Deploy Frontend as Static Site

Render can host your frontend HTML files for free as a **Static Site**.

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Select your repository again
4. Fill in the details:

   - **Name**: `attendance-system-frontend`
   - **Branch**: `main`
   - **Root Directory**: **Leave empty** (your HTML files are in `public/` folder)
     - *If it requires a value, enter `.` (single dot = current directory)*
   - **Build Command**: **Leave empty** (no build needed for plain HTML/JS)
   - **Publish Directory**: **Enter `public`** (the folder containing your HTML files)
     - *This tells Render to publish files from the `public/` directory*
     - *All your HTML, CSS, and JS files are now in the `public/` folder*

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
