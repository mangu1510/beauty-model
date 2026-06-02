# GitHub Pages Deployment Guide

## One-Time Setup

### 1. Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/mangu1510/beauty_model.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your GitHub repository: https://github.com/mangu1510/beauty_model
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - **Branch**: Should be `main`
4. Save settings

### 3. Configure Git User (first time only)
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)
Push code to `main` branch — GitHub Actions will automatically build and deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

The workflow will:
- Run on every push to `main`
- Build the project (`npm run build`)
- Deploy to GitHub Pages using `npm run deploy`

**Deployment URL**: https://mangu1510.github.io/beauty_model/

### Option 2: Manual Local Deployment
If you want to deploy manually from your machine:
```bash
npm run deploy
```

This will build and push the static files to the `gh-pages` branch.

## Sharing with Client

Share this link with your client:
```
https://mangu1510.github.io/beauty_model/
```

## Notes

- The app is deployed as a **static site** (client-side only)
- Server-side features (auth, database) will **not work** on GitHub Pages
- For full functionality (with backend), you'll need to deploy the server separately (Vercel, Netlify, or similar)
- To show backend features to the client, run locally: `npm run build && npm run preview`

## Troubleshooting

### Pages not updating after push?
- Wait 1-2 minutes for GitHub Actions to complete
- Check Actions tab for any build failures
- Clear browser cache (Ctrl+Shift+Delete)

### 404 on subpages?
- This is normal for GitHub Pages + client-side routing
- The site uses client-side routing; refresh should work
- If not, update `.github/workflows/deploy.yml` to add proper routing config

### Want to change repo name?
Update `homepage` in `package.json`:
```json
"homepage": "https://mangu1510.github.io/NEW_REPO_NAME/"
```
Then update `vite.config.ts` base path accordingly.
