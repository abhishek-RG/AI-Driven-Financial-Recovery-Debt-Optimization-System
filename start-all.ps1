# PowerShell script to start all services
# Run from project root: .\start-all.ps1

Write-Host "🚀 Starting All Services..." -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq 'Running') {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is not running. Please start MongoDB service." -ForegroundColor Yellow
    Write-Host "   Run: Start-Service MongoDB" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting services in separate windows..." -ForegroundColor Yellow
Write-Host ""

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev" -WindowStyle Normal

# Wait a bit
Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev" -WindowStyle Normal

# Wait a bit
Start-Sleep -Seconds 2

# Start Flask (optional - uncomment if needed)
# Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\virtual-cfo-flask'; .\venv\Scripts\Activate.ps1; python app.py" -WindowStyle Normal

Write-Host ""
Write-Host "✅ All services starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Services:" -ForegroundColor Cyan
Write-Host "   - Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "   - Flask:    http://localhost:5000 (if started)" -ForegroundColor White
Write-Host ""

