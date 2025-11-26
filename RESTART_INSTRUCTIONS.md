# 🔧 Fix Signup Error - Complete Instructions

## ✅ What I Fixed:

1. **Updated Backend CORS** - Now allows both port 8080 and 5173
2. **Updated Backend .env** - CORS_ORIGIN set to http://localhost:8080
3. **Verified Frontend .env** - VITE_API_BASE_URL is set correctly
4. **Database exists** - financial_recovery database is ready

## 🚀 CRITICAL: You Must Restart Both Servers

### Step 1: Restart Backend Server

**Stop the backend:**
1. Find the terminal/command prompt running the backend
2. Press `Ctrl+C` to stop it

**Start the backend:**
```powershell
cd "C:\Users\HP\OneDrive\Desktop\major-project\AI-Driven-Financial-Recovery-Debt-Optimization-System\backend"
npm run dev
```

You should see:
```
✅ Connected to MongoDB successfully
✅ Database indexes created
🚀 Server running on http://localhost:3001
📊 MongoDB Backend API ready
```

### Step 2: Restart Frontend Server

**Stop the frontend:**
1. Find the terminal running `npm run dev` (frontend)
2. Press `Ctrl+C` to stop it

**Start the frontend:**
```powershell
cd "C:\Users\HP\OneDrive\Desktop\major-project\AI-Driven-Financial-Recovery-Debt-Optimization-System"
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### Step 3: Test Signup

1. Open browser: **http://localhost:8080**
2. Go to Sign Up page
3. Fill in the form:
   - First name: Your name
   - Last name: Your last name
   - Company name: Your company
   - Email: your-email@example.com
   - Password: (at least 6 characters)
4. Click "Create Account"

## 🔍 If Still Not Working:

### Check Browser Console (F12)
Look for errors in the Console tab. Common issues:

1. **CORS Error**: Backend not restarted with new CORS settings
2. **Network Error**: Backend not running on port 3001
3. **404 Error**: Wrong API URL

### Verify Backend is Running:
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health"
```
Should return: `{"status":"ok","message":"MongoDB Backend API is running"}`

### Verify Frontend Environment:
Open browser console and type:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```
Should show: `http://localhost:3001/api`

### Check MongoDB Connection:
In MongoDB Compass, verify:
- Connected to `localhost:27017`
- Database `financial_recovery` exists
- Collections will be created automatically on first signup

## 📋 Current Configuration:

**Backend (.env in backend folder):**
```
MONGODB_URI=mongodb://localhost:27017/financial_recovery
PORT=3001
CORS_ORIGIN=http://localhost:8080
```

**Frontend (.env in project root):**
```
VITE_API_BASE_URL=http://localhost:3001/api
```

**Frontend Port:** 8080 (from vite.config.ts)

## ⚠️ Important Notes:

1. **Both servers MUST be restarted** after .env changes
2. **Frontend runs on port 8080**, not 5173
3. **Backend runs on port 3001**
4. **MongoDB must be running** (it is, based on your screenshot)

## 🎯 Expected Result:

After restarting both servers:
- ✅ No network errors
- ✅ Signup form submits successfully
- ✅ User account created in MongoDB
- ✅ Redirected to /home page
- ✅ User logged in automatically

---

**If you're still having issues after restarting both servers, check the browser console (F12) and share the error message.**

