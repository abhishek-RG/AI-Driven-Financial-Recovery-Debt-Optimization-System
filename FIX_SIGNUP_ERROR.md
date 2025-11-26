# Fix Signup Error - Quick Guide

## ✅ What Was Fixed

1. **Backend .env file created** - MongoDB connection configured
2. **Frontend .env file created** - API URL configured
3. **Backend is running** - Port 3001 is active
4. **MongoDB is running** - Database service is active
5. **Signup endpoint tested** - Working correctly

## 🔧 To Fix the Signup Error:

### Step 1: Restart Frontend Development Server

The frontend needs to be restarted to pick up the new `.env` file:

1. **Stop the current frontend server** (if running):
   - Press `Ctrl+C` in the terminal where frontend is running

2. **Start the frontend again**:
   ```powershell
   cd "C:\Users\HP\OneDrive\Desktop\major-project\AI-Driven-Financial-Recovery-Debt-Optimization-System"
   npm run dev
   ```

### Step 2: Verify Backend is Running

The backend should already be running. If not, start it:

```powershell
cd "C:\Users\HP\OneDrive\Desktop\major-project\AI-Driven-Financial-Recovery-Debt-Optimization-System\backend"
npm run dev
```

### Step 3: Test the Connection

1. Open browser: http://localhost:5173
2. Try to sign up with a new account
3. The error should be gone!

## 📋 Current Configuration

**Backend (.env in backend folder):**
- MongoDB URI: `mongodb://localhost:27017/financial_recovery`
- Port: `3001`
- CORS Origin: `http://localhost:5173`

**Frontend (.env in project root):**
- API Base URL: `http://localhost:3001/api`

## 🐛 If Still Getting Errors:

1. **Check browser console** (F12) for detailed error messages
2. **Verify backend is running**: Visit http://localhost:3001/health
3. **Check MongoDB**: Ensure MongoDB service is running
4. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)

## ✅ Verification Commands

```powershell
# Check if backend is running
Invoke-WebRequest -Uri "http://localhost:3001/health"

# Check if MongoDB is running
Get-Service -Name MongoDB

# Check if port 3001 is in use
Get-NetTCPConnection -LocalPort 3001
```

## 🎯 Expected Result

After restarting the frontend, you should be able to:
- ✅ Sign up with new account
- ✅ Sign in with existing account
- ✅ No network errors

---

**Note**: The frontend must be restarted after creating/modifying the `.env` file for Vite to pick up the changes.

