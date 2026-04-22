# RouteRadar — AI-Powered Supply Chain Risk Intelligence

> Know Your Risk Before It Knows You

RouteRadar lets users describe their supply chain in plain English and receive comprehensive AI-powered risk analysis, interactive what-if scenario chat, and a full report history.

## Architecture

```
┌─────────────┐       ┌──────────────────┐       ┌────────────────┐
│   React +   │ Axios │  Express.js API   │  SDK  │  Google AI     │
│  Tailwind   │◄─────►│  (Railway)        │◄─────►│  Studio        │
│   Frontend  │       │                  │       │  Gemini 1.5 Pro│
└─────────────┘       └───────┬──────────┘       └────────────────┘
                              │
                              │ firebase-admin
                              ▼
                      ┌──────────────────┐
                      │   Firestore      │
                      │  (reports +      │
                      │   chat history)  │
                      └──────────────────┘
```

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Tailwind CSS + Recharts  |
| Backend    | Node.js + Express.js                |
| AI         | Gemini 1.5 Pro via Google AI Studio |
| Database   | Cloud Firestore                     |
| Deployment | Firebase Hosting + Railway          |

## Quick Start (Local Development)

### Prerequisites

- Node.js ≥ 18
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- A Firebase project with Firestore enabled + a service account JSON key

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set GEMINI_API_KEY and GOOGLE_APPLICATION_CREDENTIALS
npm install
npm run dev
```

The API server starts at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. API calls are proxied to the backend automatically.

## API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| POST   | `/api/analyze`     | Analyze a supply chain description   |
| POST   | `/api/chat`        | What-if chat with report context     |
| GET    | `/api/reports`     | List all saved reports               |
| GET    | `/api/reports/:id` | Get a specific report by ID          |
| GET    | `/health`          | Health check                         |

## Deployment

### Backend → Railway

1. Go to [railway.app](https://railway.app) and log in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select this repository (`RouteRadar`).
4. Railway will auto-detect Node.js and run `npm start`.
5. In the Railway dashboard, go to **Variables** and add:
   - `GEMINI_API_KEY` — your Google AI Studio key
   - `GOOGLE_APPLICATION_CREDENTIALS` — paste the **contents** of the JSON key (as a secret file or env var, depending on Railway plan)
   - `FRONTEND_URL` — your deployed frontend URL (for CORS)
6. Copy the public Railway URL (e.g. `https://routeradar-backend.up.railway.app`) and give it to the frontend team for their `.env` file.

### Frontend → Firebase Hosting

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## Environment Variables

### Backend (`.env`)

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | API key from [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account JSON key |
| `PORT` | Server port (Railway sets this automatically) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |

## License

MIT
