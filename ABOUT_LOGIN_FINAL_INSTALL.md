# JCST About + Login Final Repair

## Install over the current project

1. Copy the patch files into the `jcst-platform` root and replace existing files.
2. Keep MongoDB running on `127.0.0.1:27017`.
3. Run:

```powershell
cd "C:\Users\Guulwade\Desktop\jcst-platform"
Set-ExecutionPolicy -Scope Process Bypass
.\FIX_ABOUT_LOGIN.ps1
```

4. Stop the running development command with `Ctrl + C`, then restart:

```powershell
npm.cmd run dev
```

5. Open `http://localhost:5173/login` and sign in with:

- Email: `admin@jcst.edu.so`
- Password: `ChangeMe-Immediately-2026!`

The script writes these same credentials to the root `.env`, resets account lock attempts, reseeds the administrator, and refreshes the About page content.

The About page fallback images now show a clean JCST branded visual without duplicate text. Actual image URLs remain editable in the Admin CMS.
