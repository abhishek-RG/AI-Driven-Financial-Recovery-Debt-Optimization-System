# Simple manual .env file creation script
# Run: .\create-env-manual.ps1

Write-Host "Creating .env files manually..." -ForegroundColor Cyan

# Frontend .env
$frontendContent = "VITE_API_BASE_URL=http://localhost:3001/api`nVITE_FLASK_API_URL=http://localhost:5000"
try {
    Set-Content -Path ".env" -Value $frontendContent -Force
    Write-Host "[OK] Created .env" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to create .env: $_" -ForegroundColor Red
}

# Backend .env
$backendContent = "MONGODB_URI=mongodb://localhost:27017/financial_recovery`nDB_NAME=financial_recovery`nJWT_SECRET=your-super-secret-jwt-key-change-this-in-production`nPORT=3001`nCORS_ORIGIN=http://localhost:8080"
try {
    if (-not (Test-Path "backend")) { New-Item -ItemType Directory -Path "backend" | Out-Null }
    Set-Content -Path "backend\.env" -Value $backendContent -Force
    Write-Host "[OK] Created backend\.env" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to create backend\.env: $_" -ForegroundColor Red
}

# Flask .env
$flaskContent = "GOOGLE_API_KEY=your-google-api-key-here`nSECRET_KEY=your-flask-secret-key-change-this-in-production`nFLASK_HOST=0.0.0.0`nFLASK_PORT=5000`nFLASK_DEBUG=True`nCORS_ORIGIN=http://localhost:8080`nMAX_UPLOAD_SIZE=10485760`nUPLOAD_FOLDER=uploads"
try {
    if (-not (Test-Path "virtual-cfo-flask")) { New-Item -ItemType Directory -Path "virtual-cfo-flask" | Out-Null }
    Set-Content -Path "virtual-cfo-flask\.env" -Value $flaskContent -Force
    Write-Host "[OK] Created virtual-cfo-flask\.env" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to create virtual-cfo-flask\.env: $_" -ForegroundColor Red
}

Write-Host "`nDone! All .env files created." -ForegroundColor Green

