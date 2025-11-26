# PM Ajay Backend - Automated Setup Script

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  PM Ajay Backend - Automated Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# [1/5] Check Node.js
Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Node.js is installed: $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""

# [2/5] Install dependencies
Write-Host "[2/5] Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Dependencies installed successfully" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# [3/5] Check .env
Write-Host "[3/5] Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "[OK] .env file found" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# [4/5] Database Setup
Write-Host "[4/5] Database Setup" -ForegroundColor Yellow
Write-Host "Make sure:" -ForegroundColor Gray
Write-Host "  1. You executed SQL schema in Supabase" -ForegroundColor Gray
Write-Host "  2. SQL Editor -> Run schema.sql" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "Have you executed the database schema? (y/n)"

if ($response -eq "y" -or $response -eq "Y") {

    Write-Host "Initializing database..." -ForegroundColor Yellow
    node scripts/initDatabase.js

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Database initialized successfully" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Database initialization failed" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "[WARNING] Please execute schema first" -ForegroundColor Yellow
    Write-Host "Run: npm run init-db" -ForegroundColor Yellow
}

Write-Host ""

# [5/5] Final message
Write-Host "[5/5] Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Start Dev Server: npm run dev" -ForegroundColor Cyan
Write-Host "Start Prod Server: npm start" -ForegroundColor Cyan
Write-Host "Init DB: npm run init-db" -ForegroundColor Cyan
Write-Host ""

$startServer = Read-Host "Start dev server now? (y/n)"

if ($startServer -eq "y" -or $startServer -eq "Y") {
    npm run dev
}
