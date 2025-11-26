# PowerShell script to create all .env files
# Run from project root: .\create-env-files.ps1

Write-Host "Creating Environment Files..." -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

try {
    # Create Frontend .env
    $frontendEnv = @'
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FLASK_API_URL=http://localhost:5000
'@
    
    $frontendPath = Join-Path $PSScriptRoot ".env"
    if (Test-Path $frontendPath) {
        Write-Host "Frontend .env already exists. Skipping..." -ForegroundColor Yellow
    } else {
        $frontendEnv | Out-File -FilePath $frontendPath -Encoding utf8 -NoNewline
        Write-Host "Created: .env (frontend)" -ForegroundColor Green
    }

    # Create Backend .env
    $backendEnv = @'
# MongoDB Backend Environment Variables
MONGODB_URI=mongodb://localhost:27017/financial_recovery
DB_NAME=financial_recovery
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-please-use-a-strong-secret-key-here
PORT=3001
CORS_ORIGIN=http://localhost:8080
'@
    
    $backendDir = Join-Path $PSScriptRoot "backend"
    $backendPath = Join-Path $backendDir ".env"
    if (-not (Test-Path $backendDir)) {
        New-Item -ItemType Directory -Path $backendDir -Force | Out-Null
    }
    if (Test-Path $backendPath) {
        Write-Host "Backend .env already exists. Skipping..." -ForegroundColor Yellow
    } else {
        $backendEnv | Out-File -FilePath $backendPath -Encoding utf8 -NoNewline
        Write-Host "Created: backend\.env" -ForegroundColor Green
    }

    # Create Flask .env
    $flaskEnv = @'
# Flask Virtual CFO Environment Variables
GOOGLE_API_KEY=your-google-api-key-here
SECRET_KEY=your-flask-secret-key-change-this-in-production
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=True
CORS_ORIGIN=http://localhost:8080
MAX_UPLOAD_SIZE=10485760
UPLOAD_FOLDER=uploads
'@
    
    $flaskDir = Join-Path $PSScriptRoot "virtual-cfo-flask"
    $flaskPath = Join-Path $flaskDir ".env"
    if (-not (Test-Path $flaskDir)) {
        New-Item -ItemType Directory -Path $flaskDir -Force | Out-Null
    }
    if (Test-Path $flaskPath) {
        Write-Host "Flask .env already exists. Skipping..." -ForegroundColor Yellow
    } else {
        $flaskEnv | Out-File -FilePath $flaskPath -Encoding utf8 -NoNewline
        Write-Host "Created: virtual-cfo-flask\.env" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "All environment files created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Update GOOGLE_API_KEY in virtual-cfo-flask\.env (if using Flask AI features)" -ForegroundColor White
    Write-Host "   2. Update MONGODB_URI in backend\.env (if using MongoDB Atlas)" -ForegroundColor White
    Write-Host "   3. Run: .\start-all.ps1" -ForegroundColor White

} catch {
    Write-Host ""
    Write-Host "Error creating .env files: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running PowerShell as Administrator or check file permissions." -ForegroundColor Yellow
    exit 1
}

