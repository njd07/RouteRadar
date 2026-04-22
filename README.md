# RouteRadar — AI-Powered Supply Chain Risk Intelligence

> Know Your Risk Before It Knows You

RouteRadar lets users describe their supply chain in plain English and receive comprehensive AI-powered risk analysis, interactive what-if scenario chat, and downloadable reports.

## Architecture

```
┌─────────────┐       ┌──────────────────┐       ┌────────────────┐
│   React +   │ Axios │  Express.js API   │ SDK   │  Vertex AI     │
│  Tailwind   │◄─────►│  (Cloud Run)      │◄─────►│  Gemini 1.5    │
│   Frontend  │       │                  │       │  Pro           │
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
| AI         | Gemini 1.5 Pro via Vertex AI        |
| Database   | Cloud Firestore                     |
| Deployment | Firebase Hosting + Cloud Run        |

## Quick Start

### Prerequisites

- Node.js ≥ 18
- Google Cloud project with Vertex AI API enabled
- Firebase project with Firestore enabled
- `gcloud` CLI authenticated (`gcloud auth application-default login`)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your GCP_PROJECT_ID and GCP_LOCATION
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

The dev server starts at `http://localhost:5173` with API requests proxied to the backend.

## API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| POST   | `/api/analyze`     | Analyze a supply chain description   |
| POST   | `/api/chat`        | What-if chat with report context     |
| GET    | `/api/reports`     | List all saved reports               |
| GET    | `/api/reports/:id` | Get a specific report by ID          |
| GET    | `/health`          | Health check                         |

## Deployment

### Backend → Cloud Run

```bash
cd backend
gcloud run deploy routeradar-backend \
  --source . \
  --region us-central1 \
  --set-env-vars GCP_PROJECT_ID=your-project,GCP_LOCATION=us-central1
```

### Frontend → Firebase Hosting

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## License

MIT
