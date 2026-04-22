import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000, // 2 min — Gemini calls can take time
});

/** POST /api/analyze */
export async function analyzeSupplyChain(description) {
  const { data } = await api.post('/analyze', { description });
  return data;
}

/** POST /api/chat */
export async function sendChatMessage(reportId, message, history) {
  const { data } = await api.post('/chat', { reportId, message, history });
  return data;
}

/** GET /api/reports */
export async function getReports() {
  const { data } = await api.get('/reports');
  return data;
}

/** GET /api/reports/:id */
export async function getReportById(id) {
  const { data } = await api.get(`/reports/${id}`);
  return data;
}

export default api;
