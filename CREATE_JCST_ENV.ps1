param(
  [string]$MongoUri = "mongodb://127.0.0.1:27017/jcst",
  [switch]$Force
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

if (-not (Test-Path ".\client\vite.config.ts")) {
  throw "client\vite.config.ts was not found. Put this script in the jcst-platform root folder."
}

if (-not (Test-Path ".\server\src\config\env.ts")) {
  throw "server\src\config\env.ts was not found. Put this script in the jcst-platform root folder."
}

function New-SecureSecret {
  $bytes = New-Object byte[] 64
  $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()

  try {
    $generator.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
  }
  finally {
    $generator.Dispose()
  }
}

function Backup-File {
  param([string]$Path)

  if (Test-Path -LiteralPath $Path) {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupPath = "$Path.backup-$timestamp"
    Copy-Item -LiteralPath $Path -Destination $backupPath
    Write-Host "Backup created: $backupPath" -ForegroundColor Yellow
  }
}

$ClientEnvPath = Join-Path $ProjectRoot ".env.local"
$ServerEnvPath = Join-Path $ProjectRoot "server\.env"

if (-not $Force) {
  if (Test-Path -LiteralPath $ClientEnvPath) {
    throw ".env.local already exists in the project root. Run with -Force to back it up and replace it."
  }

  if (Test-Path -LiteralPath $ServerEnvPath) {
    throw "server\.env already exists. Run with -Force to back it up and replace it."
  }
}

if ($Force) {
  Backup-File $ClientEnvPath
  Backup-File $ServerEnvPath
}

$AccessSecret = New-SecureSecret
$RefreshSecret = New-SecureSecret
$CookieSecret = New-SecureSecret

@"
VITE_API_BASE_URL=http://localhost:5000/api/v1
"@ | Set-Content -LiteralPath $ClientEnvPath -Encoding UTF8

@"
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
MONGODB_URI=$MongoUri

JWT_ACCESS_SECRET=$AccessSecret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=$RefreshSecret
JWT_REFRESH_EXPIRES_IN=7d

COOKIE_SECRET=$CookieSecret
COOKIE_NAME=jcst_refresh_token
BCRYPT_SALT_ROUNDS=12

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

FILE_STORAGE_PROVIDER=local
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png,image/webp

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300
LOGIN_RATE_LIMIT_MAX=10
ACCOUNT_LOCK_MAX_ATTEMPTS=5
ACCOUNT_LOCK_MINUTES=15

APP_VERSION=0.1.0
DEFAULT_TIMEZONE=Africa/Mogadishu
LOG_LEVEL=info
"@ | Set-Content -LiteralPath $ServerEnvPath -Encoding UTF8

Write-Host ""
Write-Host "JCST environment files created successfully." -ForegroundColor Green
Write-Host ""
Write-Host "Client environment:" -ForegroundColor Cyan
Write-Host "  $ClientEnvPath"
Write-Host "  VITE_API_BASE_URL=http://localhost:5000/api/v1"
Write-Host ""
Write-Host "Server environment:" -ForegroundColor Cyan
Write-Host "  $ServerEnvPath"
Write-Host "  MONGODB_URI=$MongoUri"
Write-Host ""
Write-Host "The old client\.env.local file is not used by this project because vite.config.ts sets envDir to the project root." -ForegroundColor Yellow
Write-Host ""
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "  1. Make MongoDB available on localhost:27017, or rerun this script with an Atlas URI."
Write-Host "  2. npm.cmd run dev -w @jcst/server"
Write-Host "  3. npm.cmd run dev -w @jcst/client"