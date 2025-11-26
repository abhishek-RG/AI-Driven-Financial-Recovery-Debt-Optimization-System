# 🚀 Complete Setup Guide - All Services

This guide will help you set up and run all services for the Financial Recovery System.

## 📋 Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Python** (v3.8 or higher) - [Download](https://www.python.org/)
3. **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
4. **Google API Key** (for Flask AI features) - [Get from Google AI Studio](https://makersuite.google.com/app/apikey)

## 🗂️ Project Structure

```
AI-Driven-Financial-Recovery-Debt-Optimization-System/
├── backend/              # Node.js MongoDB API
├── virtual-cfo-flask/   # Python Flask AI Service
├── src/                 # React Frontend
└── .env files           # Environment configurations
```

## ⚙️ Environment Setup

### 1. Frontend (.env in project root)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FLASK_API_URL=http://localhost:5000
```

### 2. Backend (backend/.env)
```env
MONGODB_URI=mongodb://localhost:27017/financial_recovery
DB_NAME=financial_recovery
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
CORS_ORIGIN=http://localhost:8080
```

### 3. Flask (virtual-cfo-flask/.env)
```env
GOOGLE_API_KEY=your-google-api-key-here
SECRET_KEY=your-flask-secret-key-change-this-in-production
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=True
CORS_ORIGIN=http://localhost:8080
MAX_UPLOAD_SIZE=10485760
UPLOAD_FOLDER=uploads
```

## 🚀 Quick Start Commands

### Option 1: Use PowerShell Scripts (Recommended)

**Start All Services:**
```powershell
.\start-all.ps1
```

**Start Individual Services:**
```powershell
# Backend only
.\start-backend.ps1

# Frontend only
.\start-frontend.ps1

# Flask only
.\start-flask.ps1
```

### Option 2: Manual Start

**1. Start MongoDB Backend:**
```powershell
cd backend
npm install
npm run dev
```

**2. Start Frontend:**
```powershell
# From project root
npm install
npm run dev
```

**3. Start Flask (Virtual CFO):**
```powershell
cd virtual-cfo-flask

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install -r requirements.txt

# Run Flask app
python app.py
```

## 📍 Service URLs

After starting all services:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Flask AI Service**: http://localhost:5000
- **Backend Health Check**: http://localhost:3001/health

## ✅ Verification Steps

### 1. Check MongoDB
```powershell
Get-Service -Name MongoDB
# Should show "Running"
```

### 2. Check Backend
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health"
# Should return: {"status":"ok","message":"MongoDB Backend API is running"}
```

### 3. Check Frontend
- Open browser: http://localhost:8080
- Should see the login page

### 4. Check Flask
```powershell
Invoke-WebRequest -Uri "http://localhost:5000" -ErrorAction SilentlyContinue
# Should return HTML or 200 status
```

## 🔧 Troubleshooting

### Backend Issues

**Port 3001 already in use:**
```powershell
# Find and kill process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
```

**MongoDB connection error:**
- Ensure MongoDB service is running
- Check MONGODB_URI in backend/.env
- For Atlas: Update connection string with credentials

### Frontend Issues

**Port 8080 already in use:**
- Change port in `vite.config.ts` or kill existing process

**Environment variables not loading:**
- Restart frontend server after creating/updating .env
- Ensure .env is in project root (not in src/)

### Flask Issues

**Module not found errors:**
```powershell
cd virtual-cfo-flask
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Google API Key error:**
- Update GOOGLE_API_KEY in virtual-cfo-flask/.env
- Get key from: https://makersuite.google.com/app/apikey

**Port 5000 already in use:**
- Change FLASK_PORT in virtual-cfo-flask/.env

## 🎯 Features Fixed

✅ **Real-time Dashboard Updates**
- Polling every 3 seconds
- Immediate refresh after create/delete
- Auto-refresh on window focus

✅ **Transactions, Loans, Invoices**
- Immediate refresh after create/delete
- Real-time updates via polling
- Proper error handling

✅ **MongoDB Integration**
- Full CRUD operations
- User authentication
- Data persistence

✅ **Flask AI Service**
- Environment-based configuration
- CORS properly configured
- Easy startup scripts

## 📝 Important Notes

1. **All .env files are created automatically** by the startup scripts
2. **MongoDB must be running** before starting backend
3. **Google API Key is required** for Flask AI features (optional for basic functionality)
4. **Restart servers** after changing .env files
5. **Default working directory** is project root - scripts handle cd automatically

## 🔐 Security Notes

- Change JWT_SECRET in production
- Change SECRET_KEY in production
- Never commit .env files to git
- Use strong passwords for MongoDB in production

## 📚 Additional Resources

- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [Quick Start Guide](./QUICK_START.md)
- [Restart Instructions](./RESTART_INSTRUCTIONS.md)

---

**Need Help?** Check the troubleshooting section or review the individual service logs.

