# 🛰️ RouteRadar — AI-Powered Supply Chain Risk Intelligence

> **Google Solution Challenge 2025 Project**

RouteRadar lets you describe your supply chain in plain English and instantly receive a comprehensive AI-powered risk analysis: interactive risk visualizations, real-time news grounding, vulnerability insights, and an AI what-if chat assistant.

[![Built with Gemma 4](https://img.shields.io/badge/Built%20with-Gemma%204-4285F4?style=flat&logo=google)](https://ai.google.dev)
[![Backend: Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat&logo=railway)](https://railway.app)
[![Frontend: Firebase](https://img.shields.io/badge/Frontend-Firebase%20Hosting-FFA000?style=flat&logo=firebase)](https://firebase.google.com)

---

## ✨ Features

- **Plain-English Input** — Describe your supply chain in natural language
- **Google Gemma 4 AI Analysis** — Powered by Google's open-weights Gemma model via OpenRouter
- **Real-Time News Grounding** — Automatically fetches live news (Google News RSS) and factors current disruptions into risk scores
- **Interactive Dashboard** — Score Gauge, Risk Radar Chart, World Heatmap, Segment breakdown
- **What-If Chat** — Ask the AI scenario questions about your specific supply chain
- **Report History** — Browse and reload past analyses (requires Firestore)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI** | Google Gemma 4 (`google/gemma-4-26b-a4b-it:free`) via OpenRouter |
| **Real-Time Data** | Google News RSS (no key required) |
| **Backend** | Node.js + Express |
| **Database** | Google Cloud Firestore (Firebase Admin SDK) |
| **Frontend** | React 18 + Tailwind CSS + Recharts |
| **Backend Deploy** | Railway |
| **Frontend Deploy** | Firebase Hosting |

---

## 🚀 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/njd07/RouteRadar.git
cd RouteRadar
```

### 2. Set up the backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

### 3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Free OpenRouter Key → [openrouter.ai](https://openrouter.ai) | **Yes** |
| `AI_MODEL` | Default: `google/gemma-4-26b-a4b-it:free` | Optional |
| `GOOGLE_SEARCH_API_KEY` | Google Custom Search API key (for news grounding) | Optional |
| `GOOGLE_SEARCH_CX` | Custom Search Engine ID | Optional |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account JSON | Optional (for history) |
| `PORT` | Server port (default: 8080) | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |

> The app works without `GOOGLE_APPLICATION_CREDENTIALS` — it just won't persist reports to Firestore.

---

## 📁 Project Structure

```
RouteRadar/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── gemini.js        # Gemini AI integration (parse + analyze + chat)
│   │   │   ├── search.js        # Google News RSS real-time data
│   │   │   └── firestore.js     # Firestore report persistence
│   │   ├── prompts/
│   │   │   ├── parseChain.js    # Prompt: extract segments from description
│   │   │   └── analyzeRisk.js   # Prompt: score risks + recommendations
│   │   ├── routes/
│   │   │   ├── analyze.js       # POST /api/analyze
│   │   │   ├── chat.js          # POST /api/chat/:reportId
│   │   │   └── reports.js       # GET /api/reports
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Dashboard UI components
│   │   ├── pages/               # Home, Dashboard, History
│   │   ├── context/             # ReportContext (global state)
│   │   └── services/api.js      # Axios API calls
│   └── package.json
├── DEPLOYMENT.md                # 👈 Deployment guide for teammate
└── README.md
```

---

## 🤝 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide covering Railway (backend) and Firebase Hosting (frontend).

---

## 👥 Team

Built for the **Google Solution Challenge 2025**.
