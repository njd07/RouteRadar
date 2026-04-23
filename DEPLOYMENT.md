# RouteRadar — Deployment & Setup Guide

> **For the teammate handling deployment.** This guide covers everything needed to get the backend, frontend, and database live.

---

## Architecture Overview

```text
Frontend (React)    → Firebase Hosting  
Backend (Node.js)   → Railway  
Database            → Google Cloud Firestore (Firebase)  
AI Engine           → OpenRouter (Google Gemma 4)
Real-time Data      → Google News RSS (no key needed)
```

---

## Step 1 — Clone the Repository

First, clone the repository to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/RouteRadar.git
cd RouteRadar
```

---

## Step 2 — Configure the Database (Firebase Firestore)

The **History** tab relies on Google Cloud Firestore to store past reports.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., `routeradar-db`).
3. Click on **Firestore Database** in the left menu and click **Create database**. Start in **Test Mode** (or Production Mode with open read rules).
4. **Generate the Service Account Key:**
   - Go to **Project Settings** (the gear icon) → **Service accounts**.
   - Click **Generate new private key**.
   - A JSON file will download. **Rename this file to `serviceAccountKey.json`**.
   - Move this file into the `backend/` folder of your cloned repository.
   
*(Note: If you don't do this, the app will still work in "Mock Mode", but the History tab will be empty).*

---

## Step 3 — Deploy the Backend to Railway

### 3a. Create a Railway Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub Repo** → select your `RouteRadar` repo.
3. When asked which directory to use, set **Root Directory** to `backend`.

### 3b. Set Environment Variables in Railway

In your Railway project → **Variables** tab, add these exact keys:

| Key | Value | Notes |
|-----|-------|-------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | Get this for free at [openrouter.ai](https://openrouter.ai) |
| `AI_MODEL` | `google/gemma-4-26b-a4b-it:free` | Exact model string for the hackathon |
| `PORT` | `8080` | Required for Railway |
| `FRONTEND_URL` | `https://your-frontend.web.app` | Prevents CORS errors (add this *after* Step 4) |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | *(See below)* | The content of your Firestore JSON key |

> **How to add Firestore credentials to Railway:** Railway cannot securely read local JSON files easily. Instead:
> 1. Open your downloaded `serviceAccountKey.json`.
> 2. Copy the **entire contents** as a single line (or just paste the whole JSON block).
> 3. Paste it as the value of `GOOGLE_APPLICATION_CREDENTIALS_JSON` in Railway.
> 4. Our backend is already coded to read this environment variable!

### 3c. Get Your Backend URL
After deployment, Railway will give you a public URL (e.g. `https://routeradar-backend-production.up.railway.app`). **Save this.**

---

## Step 4 — Deploy the Frontend to Firebase Hosting

### 4a. Connect Frontend to Backend
Open `frontend/.env.production` (create it if it doesn't exist) and add your Railway backend URL:
```env
VITE_API_URL=https://routeradar-backend-production.up.railway.app/api
```

### 4b. Build the React App
```bash
cd frontend
npm install
npm run build
```
This creates a `dist/` folder containing the optimized production UI.

### 4c. Deploy using Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

When prompted:
- Select the Firebase project you created in Step 2.
- Set **public directory** to: `dist`
- Configure as a **single-page app**: **Yes**
- Do NOT overwrite `dist/index.html`.

Finally, run:
```bash
firebase deploy --only hosting
```

Firebase will give you a public URL (e.g., `https://routeradar-abcde.web.app`).

---

## Step 5 — Final Linkup

Go back to **Railway** → **Variables** and update the `FRONTEND_URL` variable to your new Firebase frontend URL. This allows the backend to accept requests from your UI securely.

**You are now fully live and ready to present!**

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| History is empty | Missing Firestore setup | Ensure `serviceAccountKey.json` is set in Railway vars |
| CORS Error | `FRONTEND_URL` mismatch | Ensure Railway has the exact Firebase frontend URL |
| App stuck loading | API Rate limits | Wait a few seconds; the app will auto-fallback to mock data |
| API Analysis fails | OpenRouter key invalid | Generate a new free key at openrouter.ai |
