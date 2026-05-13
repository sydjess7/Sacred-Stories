# 🚀 Sacred Stories — Deploy Guide

## What's in this folder
```
sacred-stories/
├── public/
│   ├── index.html       ← Main HTML with PWA tags
│   ├── manifest.json    ← PWA config (name, icons, colors)
│   ├── sw.js            ← Service worker (offline support)
│   ├── icon-192.png     ← App icon (Android / Chrome)
│   ├── icon-512.png     ← App icon (large)
│   └── favicon.ico      ← Browser tab icon
├── src/
│   ├── index.js         ← React entry point
│   └── App.jsx          ← Your full app
└── package.json         ← Dependencies
```

---

## Step 1 — Install Node.js (if you haven't)
Download from: https://nodejs.org (choose LTS version)

---

## Step 2 — Deploy to Vercel (FREE, easiest option)

### Option A: Deploy via GitHub (recommended)
1. Create a free account at https://github.com
2. Create a new repository called `sacred-stories`
3. Upload all these files into it
4. Go to https://vercel.com → sign in with GitHub
5. Click **"New Project"** → select your repo
6. Click **Deploy** — done! You get a live URL like:
   `https://sacred-stories.vercel.app`

### Option B: Deploy via Vercel CLI
```bash
# In your terminal, inside the sacred-stories folder:
npm install -g vercel
npm install
npm run build
vercel --prod
```

---

## Step 3 — Install on your phone as an app

### iPhone (Safari):
1. Open your Vercel URL in **Safari**
2. Tap the **Share button** (box with arrow)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **Add** — the app appears on your home screen! 📱

### Android (Chrome):
1. Open your Vercel URL in **Chrome**
2. Tap the **three dots menu** (⋮)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **Install** — done! 📱

---

## Other free hosting options
- **Netlify**: https://netlify.com → drag & drop your `build` folder
- **GitHub Pages**: free hosting directly from your GitHub repo

---

## Adding your Anthropic API key (important!)
The app currently uses Claude's built-in API access.
If you host it yourself and it stops working, you'll need to:
1. Get an API key at https://console.anthropic.com
2. Add it to the fetch headers in `src/App.jsx`:
   ```js
   "x-api-key": "YOUR_KEY_HERE"
   ```

---

## Need help?
The whole setup takes about 15 minutes.
If you get stuck on any step, just ask Claude! 😊
