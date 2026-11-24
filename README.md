# Regina Hindu Temple — Hindu Samaj of Southern Saskatchewan

Official responsive web portal for the **Regina Hindu Temple** (3307 Pasqua St., Regina, SK), built with React, TypeScript, Vite, and Tailwind CSS. Designed for iPhone (iOS), Android, and desktop browsers with Light & Dark themes, a full-page swipeable photo gallery, an interactive 2026 Vikram Samvat festival/prasadam/booking calendar with `.ics` export, and a built-in Admin Management Panel.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Direct Deployment to GitHub Pages

This project is pre-configured for **GitHub Pages** (`vite.config.ts` uses `base: './'`, all temple photographs are bundled under `public/images/temple/`, routing uses hash URLs, and `.github/workflows/deploy.yml` automates deployment):

1. Create a new repository on GitHub and push this project to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial Regina Hindu Temple portal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. In your GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. GitHub Actions will automatically build and publish the site from `.github/workflows/deploy.yml` on every push to `main`.

## Admin Panel

- Navigate to **Admin** (`#admin`) in the top navigation bar or mobile bottom tab bar.
- Default committee passcode: `1987` (or use **One-Tap Demo Admin Access**).
- Manage Calendar & Events, Gallery Uploads, News & Announcements, Weekly Timings, Site Settings, Board & Bereavement Contacts, Inquiries Inbox, and JSON Data Backup/Restore.
