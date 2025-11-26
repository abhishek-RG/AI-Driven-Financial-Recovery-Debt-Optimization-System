# Fix .env File Creation Errors

## ✅ All .env Files Are Created!

Your environment files are already created and working:
- ✅ `.env` (frontend) - EXISTS
- ✅ `backend\.env` (backend) - EXISTS  
- ✅ `virtual-cfo-flask\.env` (flask) - EXISTS

## 🔧 If You Need to Recreate Them

### Option 1: Use the Script (Recommended)
```powershell
.\create-env-files.ps1
```

### Option 2: Use Simple Manual Script
```powershell
.\create-env-manual.ps1
```

### Option 3: Create Manually

**Frontend (.env in project root):**
```powershell
@"
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FLASK_API_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8
```

**Backend (backend\.env):**
```powershell
@"
MONGODB_URI=mongodb://localhost:27017/financial_recovery
DB_NAME=financial_recovery
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
CORS_ORIGIN=http://localhost:8080
"@ | Out-File -FilePath "backend\.env" -Encoding utf8
```

**Flask (virtual-cfo-flask\.env):**
```powershell
@"
GOOGLE_API_KEY=your-google-api-key-here
SECRET_KEY=your-flask-secret-key-change-this-in-production
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=True
CORS_ORIGIN=http://localhost:8080
MAX_UPLOAD_SIZE=10485760
UPLOAD_FOLDER=uploads
"@ | Out-File -FilePath "virtual-cfo-flask\.env" -Encoding utf8
```

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot create .env file"
**Solution:**
- Run PowerShell as Administrator
- Check file permissions
- Ensure you're in the project root directory

### Issue 2: "Execution policy error"
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: "File is blocked"
**Solution:**
```powershell
# Unblock the script
Unblock-File -Path ".\create-env-files.ps1"
```

### Issue 4: "Path not found"
**Solution:**
- Make sure you're in the project root:
```powershell
cd "C:\Users\HP\OneDrive\Desktop\major-project\AI-Driven-Financial-Recovery-Debt-Optimization-System"
```

## ✅ Verify .env Files

Check if files exist:
```powershell
Test-Path ".env"
Test-Path "backend\.env"
Test-Path "virtual-cfo-flask\.env"
```

View file contents:
```powershell
Get-Content ".env"
Get-Content "backend\.env"
Get-Content "virtual-cfo-flask\.env"
```

## 🚀 Next Steps

Once .env files are created:

1. **Update Flask API Key** (if using AI features):
   - Edit `virtual-cfo-flask\.env`
   - Replace `your-google-api-key-here` with your actual Google API key

2. **Update MongoDB URI** (if using Atlas):
   - Edit `backend\.env`
   - Replace with your MongoDB Atlas connection string

3. **Start Services:**
   ```powershell
   .\start-all.ps1
   ```

## 📝 File Locations

- Frontend: `AI-Driven-Financial-Recovery-Debt-Optimization-System\.env`
- Backend: `AI-Driven-Financial-Recovery-Debt-Optimization-System\backend\.env`
- Flask: `AI-Driven-Financial-Recovery-Debt-Optimization-System\virtual-cfo-flask\.env`

---

**All .env files are already created and ready to use!** 🎉

