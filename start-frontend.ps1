# PowerShell script to start Frontend
# Run from project root: .\start-frontend.ps1

Write-Host "🚀 Starting Frontend Development Server..." -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    @"
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FLASK_API_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created." -ForegroundColor Green
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔧 Starting frontend server on port 8080..." -ForegroundColor Green
Write-Host ""

npm run dev

