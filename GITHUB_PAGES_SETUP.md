# Quick Start — Deployment for Client

## 🚀 Share with Client

**Live Demo URL**: https://mangu1510.github.io/beauty_model/

## Prerequisites

- Git installed on your machine
- GitHub account
- Node.js 18+ (for building)

## Step 1: Push to GitHub

```bash
# Navigate to project folder
cd path/to/beauty_model

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial Beauty Model ecommerce site"

# Add remote and push
git remote add origin https://github.com/mangu1510/beauty_model.git
git branch -M main
git push -u origin main
```

## Step 2: Enable GitHub Pages

1. Open https://github.com/mangu1510/beauty_model
2. Go to **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
   - Keep everything else default
4. Click **Save**

## Step 3: Deploy

The GitHub Actions workflow will automatically deploy after you push. Wait 1-2 minutes.

**Your live site**: https://mangu1510.github.io/beauty_model/

## Making Updates

After the initial setup, just push changes to deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Site updates automatically!

## Important Notes

✅ **What Works:**
- Product browsing and shopping
- Cart, wishlist, checkout UI
- Admin dashboard
- Mobile responsive design

❌ **What Doesn't Work** (on GitHub Pages):
- User authentication (requires backend)
- Database orders (requires backend)
- Google OAuth

🔧 **For Full Features**: To test auth and database:
```bash
$env:DB_CLIENT='sqlite'
npm run build
npm run preview
```
Then open http://localhost:4173

## Sharing with Client

You can share this link directly:
```
https://mangu1510.github.io/beauty_model/
```

Or embed in an email:
> Check out the Beauty Model ecommerce demo: https://mangu1510.github.io/beauty_model/

---

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)
