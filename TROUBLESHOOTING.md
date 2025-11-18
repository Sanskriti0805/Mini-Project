# Troubleshooting Blank Page Issue

If you're seeing a blank white page at `localhost:3000`, follow these steps:

## Step 1: Check Browser Console

1. Open your browser's Developer Tools:
   - Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Or right-click → "Inspect"

2. Go to the **Console** tab

3. Look for any **red error messages**

Common errors you might see:
- `GEMINI_API_KEY is not set` - You need to create `.env.local` file
- `Cannot find module` - Dependencies not installed
- `ReferenceError` - JavaScript error in the code

## Step 2: Check Terminal/Command Prompt

Look at the terminal where you ran `npm run dev`. Check for:
- ✅ `VITE v6.x.x ready` - Server is running
- ❌ Any error messages in red
- ❌ Build/compilation errors

## Step 3: Verify Setup

### Check if dependencies are installed:
```bash
cd C:\Users\Sanskriti\Mini-Project
npm list --depth=0
```

You should see:
- react
- react-dom
- @google/genai
- vite
- typescript

### Check if .env.local exists:
```bash
# In PowerShell:
Test-Path .env.local

# Should return: True
```

If it returns `False`, create the file:
1. Create a new file named `.env.local` in the project root
2. Add this line (replace with your actual API key):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Get your API key from: https://aistudio.google.com/apikey

### Restart the dev server:
1. Stop the server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 4: Clear Browser Cache

Sometimes cached files can cause issues:
1. Press `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
2. Clear cached images and files
3. Or try **Hard Refresh**: `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)

## Step 5: Check Network Tab

1. Open Developer Tools (`F12`)
2. Go to **Network** tab
3. Refresh the page (`F5`)
4. Look for:
   - Failed requests (shown in red)
   - 404 errors (file not found)
   - 500 errors (server error)

## Common Issues and Solutions

### Issue: "Cannot find module 'react'"
**Solution:** Run `npm install` again

### Issue: "GEMINI_API_KEY is not set"
**Solution:** Create `.env.local` file with your API key

### Issue: Port 3000 already in use
**Solution:** 
- Change port in `vite.config.ts` (line 9) to `3001` or another port
- Or stop the process using port 3000

### Issue: Blank page with no errors
**Solution:**
1. Check if `index.html` has the root div: `<div id="root"></div>`
2. Verify `index.tsx` is importing and rendering the App component
3. Make sure Vite is serving the files correctly

## Still Not Working?

1. **Delete node_modules and reinstall:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

2. **Check Vite version compatibility:**
   ```bash
   npm list vite
   ```
   Should be version 6.x.x

3. **Try a different browser** (Chrome, Firefox, Edge)

4. **Check if TypeScript compilation is working:**
   ```bash
   npx tsc --noEmit
   ```
   This will show any TypeScript errors

## Getting Help

If none of these work, please share:
1. Browser console errors (screenshot or copy text)
2. Terminal output from `npm run dev`
3. Contents of your `.env.local` file (WITHOUT the actual API key - just confirm it exists)

