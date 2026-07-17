# JCST About and Login Repair

This repair uses the root `.env` file, resets the development administrator, and refreshes the About page content.

1. Keep MongoDB running on port `27017`.
2. From the project root run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\FIX_ABOUT_LOGIN.ps1
```

3. Stop and restart `npm.cmd run dev`.
4. Sign in with:

- Email: `admin@jcst.edu.so`
- Password: `ChangeMe-Immediately-2026!`

Change this password before a production deployment. The About page image URLs remain editable from the Admin CMS. When an image is empty or unavailable, a clean JCST branded background is shown without overlapping text.
