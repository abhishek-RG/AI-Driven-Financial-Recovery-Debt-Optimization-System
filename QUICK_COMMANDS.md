# ⚡ Quick Command Reference

All commands run from project root: `AI-Driven-Financial-Recovery-Debt-Optimization-System`

## 🚀 Start Services

### Start All Services (Recommended)
```powershell
.\start-all.ps1
```

### Start Individual Services

**Backend (MongoDB API):**
```powershell
.\start-backend.ps1
# OR manually:
cd backend
npm run dev
```

**Frontend (React):**
```powershell
.\start-frontend.ps1
# OR manually:
npm run dev
```

**Flask (Virtual CFO AI):**
```powershell
.\start-flask.ps1
# OR manually:
cd virtual-cfo-flask
.\venv\Scripts\Activate.ps1
python app.py
```

## 📦 First Time Setup

### Backend Setup
```powershell
cd backend
npm install
# .env file is auto-created by start-backend.ps1
```

### Frontend Setup
```powershell
# From project root
npm install
# .env file is auto-created by start-frontend.ps1
```

### Flask Setup
```powershell
cd virtual-cfo-flask

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# .env file is auto-created by start-flask.ps1
# IMPORTANT: Update GOOGLE_API_KEY in .env
```

## 🔍 Check Services

### Check MongoDB
```powershell
Get-Service -Name MongoDB
```

### Check Backend
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health"
```

### Check Flask
```powershell
Invoke-WebRequest -Uri "http://localhost:5000" -ErrorAction SilentlyContinue
```

## 🛑 Stop Services

Press `Ctrl+C` in each terminal window running the services.

## 🔧 Fix Common Issues

### Port Already in Use
```powershell
# Find process using port 3001
Get-NetTCPConnection -LocalPort 3001 | Select-Object OwningProcess

# Kill process (replace PID)
Stop-Process -Id <PID>
```

### MongoDB Not Running
```powershell
Start-Service MongoDB
```

### Environment Variables Not Loading
1. Stop the service (Ctrl+C)
2. Restart the service
3. Vite/Node need restart to pick up .env changes

## 📝 Environment Files Location

- **Frontend**: `.env` (project root)
- **Backend**: `backend/.env`
- **Flask**: `virtual-cfo-flask/.env`

## 🌐 Service URLs

- Frontend: http://localhost:8080
- Backend: http://localhost:3001
- Flask: http://localhost:5000
- Backend Health: http://localhost:3001/health

---

**💡 Tip**: Use `.\start-all.ps1` to start everything at once!

