# PowerShell script to start Flask Virtual CFO
# Run from project root: .\start-flask.ps1

Write-Host "🚀 Starting Flask Virtual CFO Server..." -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot\virtual-cfo-flask"

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    @"
# Google Generative AI API Key (Required)
GOOGLE_API_KEY=your-google-api-key-here
SECRET_KEY=your-flask-secret-key-change-this-in-production
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=True
CORS_ORIGIN=http://localhost:8080
MAX_UPLOAD_SIZE=10485760
UPLOAD_FOLDER=uploads
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created. Please update GOOGLE_API_KEY with your API key." -ForegroundColor Green
    Write-Host "⚠️  WARNING: Flask will not work without GOOGLE_API_KEY!" -ForegroundColor Red
}

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Check if requirements are installed
if (-not (Test-Path "venv\Lib\site-packages\flask")) {
    Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Starting Flask server on port 5000..." -ForegroundColor Green
Write-Host ""

python app.py

