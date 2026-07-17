# JCST Platform — Quick Start

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- MongoDB running on `127.0.0.1:27017`, or a MongoDB Atlas URI

## 1. Create the environment file

Copy the example file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and replace all placeholder secrets. The client reads the same root environment file through Vite's `envDir` configuration.

Generate secure secrets in PowerShell:

```powershell
function New-Secret {
  $bytes = New-Object byte[] 64
  [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
  [Convert]::ToBase64String($bytes)
}
New-Secret
```

## 2. Install dependencies

```powershell
npm.cmd install
```

## 3. Start MongoDB

When MongoDB 6.0 is installed without a Windows service:

```powershell
New-Item -ItemType Directory -Force "$HOME\mongodb-data\jcst" | Out-Null
& "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="$HOME\mongodb-data\jcst" --bind_ip=127.0.0.1 --port=27017
```

Keep that terminal open.

## 4. Seed the initial data

```powershell
npm.cmd run seed
```

To reset the public website content to the official seed:

```powershell
npm.cmd run seed:website:force
```


## Default local administrator

After `npm.cmd run seed:admin`, use:

- Email: `admin@jcst.edu.so`
- Password: `ChangeMe-Immediately-2026!`

To reset the local administrator and repair the About page:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\FIX_ABOUT_LOGIN.ps1
```

## 5. Start the platform

Run both applications together:

```powershell
npm.cmd run dev
```

Or start them separately:

```powershell
npm.cmd run dev -w @jcst/server
npm.cmd run dev -w @jcst/client
```

Open:

- Public website: `http://localhost:5173`
- API: `http://localhost:5000/api/v1`
- Admin: `http://localhost:5173/admin`

## Admin content structure

Each public content area has its own admin page:

- Site Settings
- Navigation
- Footer
- Reusable Text
- Public Pages
- Homepage Sections
- Departments
- Programs
- Courses
- Lecturers
- Announcements
- FAQs
- Facilities
- Testimonials
- Statistics

Text, images, visibility, ordering and page-specific metadata are stored in MongoDB. Phone links use `tel:`, emails use `mailto:`, and WhatsApp links use `wa.me` where configured.

## Verification commands

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd test
```
