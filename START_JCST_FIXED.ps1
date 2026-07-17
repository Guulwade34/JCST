param(
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-Port {
  param(
    [string]$HostName,
    [int]$Port
  )

  try {
    return [bool](Test-NetConnection `
      -ComputerName $HostName `
      -Port $Port `
      -InformationLevel Quiet `
      -WarningAction SilentlyContinue)
  }
  catch {
    return $false
  }
}

function Wait-Port {
  param(
    [string]$HostName,
    [int]$Port,
    [int]$TimeoutSeconds = 30
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  do {
    if (Test-Port -HostName $HostName -Port $Port) {
      return $true
    }

    Start-Sleep -Seconds 1
  } while ((Get-Date) -lt $deadline)

  return $false
}

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Write-Host "JCST PLATFORM STARTUP" -ForegroundColor Yellow
Write-Host "Project: $ProjectRoot"

if (-not (Test-Path ".\package.json")) {
  throw "package.json was not found. Put this script in the jcst-platform root folder."
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is not available in PATH."
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
  throw "npm.cmd is not available in PATH."
}

Write-Step "Checking environment files"

if (-not (Test-Path ".\.env.local")) {
  @"
VITE_API_BASE_URL=http://localhost:5000/api/v1
"@ | Set-Content -LiteralPath ".\.env.local" -Encoding UTF8
}

if (-not (Test-Path ".\server\.env")) {
  throw "server\.env is missing."
}

Write-Host "Environment files found." -ForegroundColor Green

Write-Step "Starting MongoDB"

if (-not (Test-Port -HostName "127.0.0.1" -Port 27017)) {
  Get-Process mongod -ErrorAction SilentlyContinue |
    Stop-Process -Force -ErrorAction SilentlyContinue

  $MongoExecutable = Get-ChildItem `
    "C:\Program Files\MongoDB\Server" `
    -Recurse `
    -Filter "mongod.exe" `
    -File `
    -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1

  if (-not $MongoExecutable) {
    throw "mongod.exe was not found under C:\Program Files\MongoDB\Server."
  }

  $MongoDataPath = Join-Path $env:USERPROFILE "mongodb-data\jcst"
  $MongoLogFolder = Join-Path $env:USERPROFILE "mongodb-data\logs"
  $MongoLogPath = Join-Path $MongoLogFolder "jcst-mongod.log"

  New-Item -ItemType Directory -Force -Path $MongoDataPath | Out-Null
  New-Item -ItemType Directory -Force -Path $MongoLogFolder | Out-Null

  Write-Host "MongoDB executable: $($MongoExecutable.FullName)"
  Write-Host "MongoDB data path:  $MongoDataPath"
  Write-Host "MongoDB log path:   $MongoLogPath"

  $MongoProcess = Start-Process `
    -FilePath $MongoExecutable.FullName `
    -ArgumentList @(
      "--dbpath", $MongoDataPath,
      "--bind_ip", "127.0.0.1",
      "--port", "27017",
      "--logpath", $MongoLogPath,
      "--logappend"
    ) `
    -PassThru `
    -WindowStyle Minimized

  if (-not (Wait-Port -HostName "127.0.0.1" -Port 27017 -TimeoutSeconds 30)) {
    Write-Host ""
    Write-Host "MongoDB failed to start. Last log lines:" -ForegroundColor Red

    if (Test-Path $MongoLogPath) {
      Get-Content $MongoLogPath -Tail 30
    } else {
      Write-Host "No MongoDB log file was created."
    }

    if ($MongoProcess.HasExited) {
      Write-Host "MongoDB exit code: $($MongoProcess.ExitCode)" -ForegroundColor Red
    }

    throw "MongoDB did not start on port 27017."
  }

  Write-Host "MongoDB started successfully." -ForegroundColor Green
} else {
  Write-Host "MongoDB is already running." -ForegroundColor Green
}

Write-Step "Starting JCST API"

if (-not (Test-Port -HostName "127.0.0.1" -Port 5000)) {
  $BackendCommand = @"
Set-Location "$ProjectRoot"
npm.cmd run dev -w @jcst/server
"@

  Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", $BackendCommand
  )

  if (-not (Wait-Port -HostName "127.0.0.1" -Port 5000 -TimeoutSeconds 45)) {
    throw "JCST API did not start on port 5000. Read the backend terminal error."
  }

  Write-Host "JCST API started successfully." -ForegroundColor Green
} else {
  Write-Host "JCST API is already running." -ForegroundColor Green
}

Write-Step "Testing website API"

$Bootstrap = Invoke-RestMethod `
  -Uri "http://localhost:5000/api/v1/website/bootstrap" `
  -Method Get `
  -TimeoutSec 20

if ($Bootstrap.success -ne $true) {
  throw "Website bootstrap returned success=false."
}

Write-Host "Website bootstrap API is healthy." -ForegroundColor Green

Write-Step "Starting Vite client"

if (-not (Test-Port -HostName "127.0.0.1" -Port 5173)) {
  $ClientCommand = @"
Set-Location "$ProjectRoot"
npm.cmd run dev -w @jcst/client
"@

  Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", $ClientCommand
  )

  if (-not (Wait-Port -HostName "127.0.0.1" -Port 5173 -TimeoutSeconds 40)) {
    throw "JCST client did not start on port 5173."
  }

  Write-Host "JCST client started successfully." -ForegroundColor Green
} else {
  Write-Host "JCST client is already running." -ForegroundColor Green
}

Write-Host ""
Write-Host "JCST IS READY" -ForegroundColor Green
Write-Host "Website: http://localhost:5173"
Write-Host "API:     http://localhost:5000/api/v1"
Write-Host "MongoDB: mongodb://127.0.0.1:27017/jcst"
Write-Host ""

if (-not $NoBrowser) {
  Start-Process "http://localhost:5173"
}
