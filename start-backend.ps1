# PowerShell script to start MongoDB Backend
# Run from project root: .\start-backend.ps1

Write-Host "🚀 Starting MongoDB Backend Server..." -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot\backend"

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    @"
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/financial_recovery
DB_NAME=financial_recovery
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
CORS_ORIGIN=http://localhost:8080
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created. Please update with your MongoDB connection details." -ForegroundColor Green
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔧 Starting backend server on port 3001..." -ForegroundColor Green
Write-Host ""

npm run dev

