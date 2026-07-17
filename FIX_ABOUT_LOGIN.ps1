param(
  [string]$Email = "admin@jcst.edu.so",
  [string]$Password = "ChangeMe-Immediately-2026!"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

function Set-EnvValue {
  param(
    [string]$Path,
    [string]$Name,
    [string]$Value
  )

  $lines = if (Test-Path -LiteralPath $Path) {
    @(Get-Content -LiteralPath $Path)
  } else {
    @()
  }

  $pattern = "^$([regex]::Escape($Name))="
  $replacement = "$Name=$Value"
  $updated = $false

  for ($index = 0; $index -lt $lines.Count; $index++) {
    if ($lines[$index] -match $pattern) {
      $lines[$index] = $replacement
      $updated = $true
      break
    }
  }

  if (-not $updated) {
    $lines += $replacement
  }

  $lines | Set-Content -LiteralPath $Path -Encoding UTF8
}

if (-not (Test-Path ".\package.json")) {
  throw "Put FIX_ABOUT_LOGIN.ps1 in the jcst-platform root folder."
}

$RootEnv = Join-Path $ProjectRoot ".env"

if (-not (Test-Path -LiteralPath $RootEnv)) {
  if (Test-Path ".\.env.example") {
    Copy-Item ".\.env.example" $RootEnv
  } else {
    throw ".env is missing and .env.example was not found."
  }
}

$mongoReady = Test-NetConnection 127.0.0.1 -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $mongoReady) {
  throw "MongoDB is not running on port 27017. Start MongoDB first."
}

Set-EnvValue -Path $RootEnv -Name "SEED_ADMIN_EMAIL" -Value $Email
Set-EnvValue -Path $RootEnv -Name "SEED_ADMIN_PASSWORD" -Value $Password
Set-EnvValue -Path $RootEnv -Name "SEED_ADMIN_FIRST_NAME" -Value "JCST"
Set-EnvValue -Path $RootEnv -Name "SEED_ADMIN_LAST_NAME" -Value "Administrator"

$env:SEED_ADMIN_EMAIL = $Email
$env:SEED_ADMIN_PASSWORD = $Password
$env:SEED_ADMIN_FIRST_NAME = "JCST"
$env:SEED_ADMIN_LAST_NAME = "Administrator"

Write-Host "Resetting the JCST administrator account..." -ForegroundColor Cyan
npm.cmd run seed:admin

Write-Host "Repairing the About page database content..." -ForegroundColor Cyan
npm.cmd run seed:about

Write-Host ""
Write-Host "ABOUT AND LOGIN WERE REPAIRED" -ForegroundColor Green
Write-Host "Admin email:    $Email"
Write-Host "Admin password: $Password"
Write-Host ""
Write-Host "Restart npm.cmd run dev, then sign in with the credentials above." -ForegroundColor Yellow
