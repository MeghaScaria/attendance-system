# 🔧 Troubleshooting: Connection Error

You're seeing: **"Connection error. Please check if the backend server is running."**

This means your frontend can't connect to your backend. Let's fix it step by step!

---

## ✅ Step 1: Check if Backend is Deployed

**Go to your Render Dashboard:**
1. Visit: https://dashboard.render.com
2. Look for your backend service (should be named something like `attendance-system-backend` or `praja-kirana-seva-attendance-system`)

**Check the status:**
- ✅ **"Live"** = Backend is running (good!)
- ⚠️ **"Building"** = Still deploying (wait 2-5 minutes)
- ❌ **"Failed"** = Deployment failed (check logs)
- ⏸️ **"Suspended"** = Service stopped (click "Manual Deploy")

---

## ✅ Step 2: Test Backend URL Directly

**Your backend URL is:** `https://praja-kirana-seva-attendance-system.onrender.com`

**Test it in your browser:**
1. Open a new tab
2. Go to: `https://praja-kirana-seva-attendance-system.onrender.com/api/health`
3. You should see: `{"status":"OK","message":"Backend running successfully"}`

**What this means:**
- ✅ **If you see the JSON response**: Backend is working! Problem is in frontend configuration
- ❌ **If you see "Site can't be reached" or error**: Backend isn't deployed or isn't running
- ⏳ **If it takes 30+ seconds then works**: Backend was sleeping (free tier spins down after 15 min inactivity)

---

## ✅ Step 3: Verify Backend URL in Frontend

**Check `api-config.js`:**

Your current URL is:
```javascript
baseURL: 'https://praja-kirana-seva-attendance-system.onrender.com/api'
```

**Make sure:**
- ✅ URL starts with `https://` (not `http://`)
- ✅ URL ends with `/api` (not just the domain)
- ✅ No extra slashes or spaces
- ✅ Matches exactly what's in Render dashboard

---

## ✅ Step 4: Check Browser Console

**Open browser developer tools:**
1. Press `F12` (or right-click → Inspect)
2. Go to **"Console"** tab
3. Try logging in again
4. Look for error messages

**Common errors you might see:**
- `Failed to fetch` = Backend URL is wrong or backend is down
- `CORS error` = Backend CORS not configured (but we already have this)
- `404 Not Found` = URL path is wrong
- `Network error` = Backend isn't accessible

---

## ✅ Step 5: Common Issues & Solutions

### Issue 1: Backend Not Deployed Yet

**Solution:**
- Go to Render dashboard
- Deploy your backend first (Step 3 in DEPLOYMENT_GUIDE.md)
- Wait for it to show "Live"
- Then try frontend again

### Issue 2: Backend URL Wrong

**Solution:**
1. Go to Render dashboard
2. Click on your backend service
3. Copy the exact URL shown (should be something like `https://xxxx.onrender.com`)
4. Update `api-config.js`:
   ```javascript
   baseURL: 'https://YOUR-ACTUAL-URL.onrender.com/api',
   ```
5. Save and refresh frontend

### Issue 3: Backend is Sleeping (Free Tier)

**Solution:**
- Free tier spins down after 15 minutes of inactivity
- First request takes ~30 seconds (it's waking up)
- This is normal! Just wait and try again
- Or upgrade to paid plan for always-on service

### Issue 4: CORS Error

**Solution:**
- Backend already has CORS enabled
- If you still see CORS errors, check:
  - Backend URL in `api-config.js` is correct
  - Backend is actually running
  - No typos in the URL

### Issue 5: Frontend Not Updated

**Solution:**
- If you updated `api-config.js` but didn't push to GitHub:
  1. Save the file
  2. Push to GitHub:
     ```bash
     git add api-config.js
     git commit -m "Fix backend URL"
     git push
     ```
  3. Wait for Render to redeploy frontend (2-5 minutes)
  4. Try again

---

## ✅ Step 6: Quick Test Checklist

Run through this checklist:

- [ ] Backend is deployed on Render (shows "Live")
- [ ] Backend URL test works: `https://your-backend.onrender.com/api/health`
- [ ] `api-config.js` has correct backend URL (with `/api` at end)
- [ ] Frontend has been redeployed after updating `api-config.js`
- [ ] Browser console shows no errors (or specific error we can fix)
- [ ] Tried refreshing the page (Ctrl+F5 to clear cache)

---

## 🆘 Still Not Working?

**Share these details:**
1. What does `https://praja-kirana-seva-attendance-system.onrender.com/api/health` show in your browser?
2. What's the exact error in browser console (F12 → Console)?
3. What's the status of your backend in Render dashboard?
4. Did you update `api-config.js` and push to GitHub?

**I can help you fix it once I know these details!** 😊
