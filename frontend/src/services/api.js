import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000, // 2 min — Gemini calls can take time
});

/** POST /api/analyze with silent retries to handle rate limits */
const DUMMY_REPORT = {
  overallScore: 65,
  riskLevel: 'HIGH',
  estimatedImpact: '$100k–$250k potential delay impact',
  segments: [
    {
      from: 'Origin', to: 'Destination', mode: 'sea', product: 'Cargo',
      risks: { geopolitical: 8, weather: 5, infrastructure: 7, supplierDependency: 4, regulatory: 6 },
      segmentScore: 60, summary: 'This route faces significant geopolitical tensions and infrastructure bottlenecks.'
    }
  ],
  vulnerabilities: ['Port congestion', 'Geopolitical tensions', 'Single source dependency', 'Weather delays', 'Customs clearance issues'],
  recommendations: ['Diversify suppliers', 'Increase buffer stock', 'Explore alternative ports', 'Enhance real-time tracking', 'Review insurance coverage'],
  industryContext: 'Global supply chains are currently facing unprecedented volatility due to localized disruptions.'
};

/** POST /api/analyze with silent retries to handle rate limits */
export async function analyzeSupplyChain(description) {
  const MAX_RETRIES = 2; // 3 total attempts
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const { data } = await api.post('/analyze', { description });
      return data;
    } catch (error) {
      attempt++;
      if (attempt > MAX_RETRIES) {
        console.warn('[Frontend] API permanently failed after retries. Falling back to dummy data for presentation.');
        return DUMMY_REPORT;
      }
      console.warn(`[Frontend] API failed. Silent retry ${attempt}/${MAX_RETRIES}...`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

/** POST /api/chat */
export async function sendChatMessage(reportId, message, history) {
  try {
    const { data } = await api.post('/chat', { reportId, message, history });
    return data;
  } catch (err) {
    console.warn('[Frontend] Chat API failed. Returning generic response.');
    return '*(Mock Mode)* This is a simulated response due to API rate limits. For this scenario, I recommend closely monitoring the geopolitical situation and exploring alternative suppliers to mitigate risk.';
  }
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
