# Troubleshooting: No Console Output on Directory Page

If you're seeing **nothing at all** in the console when opening the Directory page, follow these steps:

## Step 1: Verify Console is Open and Not Filtered

1. **Open Developer Tools** (`F12`)
2. **Click the Console tab**
3. **Check the filter buttons** at the top of the console:
   - Make sure **"All levels"** is selected (or at least "Info", "Warnings", "Errors")
   - Click the filter icon (funnel) and ensure nothing is filtered out
   - Clear any text in the filter/search box

4. **Clear the console:**
   - Click the 🚫 icon (Clear console)
   - OR press `Ctrl + L` (Windows) / `Cmd + K` (Mac)

## Step 2: Check if Scripts are Loading

1. **Go to the Network tab** (next to Console)
2. **Refresh the page** (`F5` or `Ctrl + R`)
3. **Look for these files:**
   - `directory.js` - Should show status **200** (green)
   - `script.js` - Should show status **200** (green)
   - `api-config.js` - Should show status **200** (green)

**If any show 404 (red):**
- The file is missing or path is wrong
- Check the file exists in your project

**If files show "blocked" or "failed":**
- There might be a CORS issue
- Check if the server is running

## Step 3: Check for JavaScript Errors

Even if console is empty, errors might be preventing scripts from running:

1. **Look at the Network tab:**
   - Find `directory.js`
   - Click on it
   - Go to **Response** tab
   - Verify the file content is there (should start with `// Directory page functionality`)

2. **Check the Console for red errors:**
   - Even if you see nothing else, errors should appear
   - Look for messages like:
     - `Uncaught SyntaxError`
     - `Uncaught ReferenceError`
     - `Failed to load resource`

## Step 4: Test if JavaScript is Working at All

1. **In the Console tab, type this and press Enter:**
   ```javascript
   console.log('Test message');
   ```

2. **You should see "Test message" appear**
   - If you don't see it, the console might be broken or filtered
   - Try a different browser

3. **Try this to check if directory.js loaded:**
   ```javascript
   typeof initDirectory
   ```
   - Should return `"function"` if the script loaded
   - If it returns `"undefined"`, the script didn't load

## Step 5: Check Authentication Redirect

The `script.js` file has authentication that might redirect you:

1. **Check if you're logged in:**
   - In Console, type: `sessionStorage.getItem('authToken')`
   - If it returns `null`, you're not logged in
   - You might be getting redirected to login page before directory.js runs

2. **Try this:**
   - Log in first
   - Then navigate to Directory page
   - Check console again

## Step 6: Manual Test

1. **Open the page**
2. **In Console, type:**
   ```javascript
   document.getElementById('directoryGrid')
   ```
   - Should return the HTML element
   - If it returns `null`, the page structure is wrong

3. **Try calling the function manually:**
   ```javascript
   initDirectory()
   ```
   - This should trigger all the console logs
   - If you get an error, that's the problem!

## Step 7: Check Browser Console Settings

Some browsers have settings that hide console output:

### Chrome/Edge:
1. Click the three dots (⋮) in console
2. Check "Show timestamps" (optional)
3. Make sure "Hide network messages" is NOT checked
4. Check "Preserve log" to keep messages after navigation

### Firefox:
1. Click the gear icon in console
2. Check "Show timestamps" (optional)
3. Make sure "Persist Logs" is checked

## Step 8: Try a Different Browser

Sometimes browser extensions or settings can interfere:

1. **Try opening in:**
   - Incognito/Private mode (disables extensions)
   - A different browser (Chrome, Firefox, Edge)

2. **If it works in incognito:**
   - An extension is blocking it
   - Disable extensions one by one to find the culprit

## Step 9: Check if Page is Actually Loading

1. **Look at the page itself:**
   - Do you see "Loading directory..."?
   - Do you see the sidebar and header?
   - Or is the page blank/white?

2. **If page is blank:**
   - Check Network tab for HTML file
   - Verify `directory.html` loaded with status 200

## Step 10: Verify File Paths

The HTML file loads scripts like this:
```html
<script src="script.js"></script>
<script src="api-config.js"></script>
<script src="directory.js"></script>
```

**Check:**
1. Are these files in the same folder as `directory.html`?
2. If not, the paths are wrong
3. Check Network tab to see what URLs are being requested

## Quick Diagnostic Commands

Run these in the Console to diagnose:

```javascript
// Check if scripts loaded
console.log('script.js loaded:', typeof checkAuth);
console.log('api-config.js loaded:', typeof ApiService);
console.log('directory.js loaded:', typeof initDirectory);

// Check page state
console.log('Document ready:', document.readyState);
console.log('Current page:', window.location.pathname);

// Check authentication
console.log('Has token:', !!sessionStorage.getItem('authToken'));

// Check if elements exist
console.log('directoryGrid exists:', !!document.getElementById('directoryGrid'));
console.log('loadingState exists:', !!document.getElementById('loadingState'));
```

## What to Report

If still nothing works, provide:

1. **Browser and version:** (e.g., Chrome 120, Firefox 121)
2. **Screenshot of Network tab:** Show all file requests
3. **Screenshot of Console:** Even if empty
4. **Result of diagnostic commands:** Copy/paste the output
5. **What you see on the page:** Screenshot

## Most Common Causes

1. **Console is filtered** - Check filter settings
2. **Scripts not loading** - Check Network tab for 404 errors
3. **Authentication redirect** - Not logged in, getting redirected
4. **JavaScript error** - Check for red errors in console
5. **Browser extension** - Try incognito mode
