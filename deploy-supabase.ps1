# Vottery Supabase Deployment Script
# Run this after: supabase login (one-time, opens browser)

$ErrorActionPreference = "Stop"
$ProjectRef = "mdmdlhmtjmznmvkmgrzb"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "=== Vottery Supabase Deployment ===" -ForegroundColor Cyan

# 1. Check login
Write-Host "`n[1/4] Checking Supabase login..." -ForegroundColor Yellow
try {
    supabase projects list 2>&1 | Out-Null
} catch {}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please run 'supabase login' first (opens browser)." -ForegroundColor Red
    supabase login
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

# 2. Link project
Write-Host "`n[2/4] Linking project..." -ForegroundColor Yellow
if (-not (Test-Path ".supabase")) {
    supabase link --project-ref $ProjectRef
    if ($LASTEXITCODE -ne 0) { exit 1 }
} else {
    Write-Host "Project already linked." -ForegroundColor Green
}

# 3. Run migrations
Write-Host "`n[3/4] Pushing migrations..." -ForegroundColor Yellow
supabase db push
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "Migrations applied." -ForegroundColor Green

# 4. Deploy Edge Function
Write-Host "`n[4/4] Deploying platform-gamification-api..." -ForegroundColor Yellow
supabase functions deploy platform-gamification-api
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "Function deployed." -ForegroundColor Green

# 5. Set secret (generate if not set)
$ApiKey = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
Write-Host "`n[5/5] Setting PLATFORM_GAMIFICATION_API_KEY..." -ForegroundColor Yellow
supabase secrets set "PLATFORM_GAMIFICATION_API_KEY=$ApiKey"
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "Secret set." -ForegroundColor Green

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host "API Key for Platform Gamification (save this): $ApiKey" -ForegroundColor Yellow
