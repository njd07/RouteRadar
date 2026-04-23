const OpenAI = require('openai');
const { getParseChainPrompt } = require('../prompts/parseChain');
const { getAnalyzeRiskPrompt } = require('../prompts/analyzeRisk');

// ─── Client ───────────────────────────────────────────────────────────────────
// Using OpenRouter to access Google's Gemma models for free
const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://routeradar.app',
    'X-Title': 'RouteRadar',
  },
});

const MODEL = process.env.AI_MODEL || 'google/gemma-2-9b-it:free';

// ─── Exponential Backoff Retry Wrapper ────────────────────────────────────────
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err?.message?.includes('429') || err?.status === 429;
      const isLast = attempt === maxRetries;
      if (isRateLimit && !isLast) {
        const delay = Math.pow(2, attempt + 1) * 2000; 
        console.log(`⚠️  Rate limited. Retrying in ${delay / 1000}s… (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

// ─── Helper: Clean JSON ───────────────────────────────────────────────────────
// Open-weights models sometimes wrap JSON in markdown blocks despite instructions
function cleanJson(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '');
  if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '');
  if (cleaned.endsWith('```')) cleaned = cleaned.replace(/```$/, '');
  return cleaned.trim();
}

// ─── Step 1: Parse Supply Chain Description ───────────────────────────────────
async function parseSupplyChain(description) {
  const prompt = getParseChainPrompt(description);

  try {
    const completion = await withRetry(() =>
      client.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      })
    );

    const text = completion.choices[0].message.content;
    const parsed = JSON.parse(cleanJson(text));

    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.segments)) return parsed.segments;
    const firstArr = Object.values(parsed).find(v => Array.isArray(v));
    if (firstArr) return firstArr;
    throw new Error('Could not extract segments from response');
  } catch (err) {
    console.error('OpenRouter parseSupplyChain error:', err.message);
    throw new Error(`Failed to parse supply chain: ${err.message}`);
  }
}

// ─── Step 2: Analyse Risks ────────────────────────────────────────────────────
async function analyzeRisks(segments) {
  const prompt = getAnalyzeRiskPrompt(segments);

  try {
    const completion = await withRetry(() =>
      client.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      })
    );

    const text = completion.choices[0].message.content;
    return JSON.parse(cleanJson(text));
  } catch (err) {
    console.error('OpenRouter analyzeRisks error:', err.message);
    throw new Error(`Failed to analyze risks: ${err.message}`);
  }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
async function chatWithContext(report, history, message) {
  const systemPrompt = `You are RouteRadar AI, a supply chain risk expert. 
The user's supply chain has an overall risk score of ${report.overallScore}/100 (${report.riskLevel}).
Segments: ${report.segments.map(s => `${s.from} → ${s.to} via ${s.mode}`).join(', ')}.
Key vulnerabilities: ${(report.vulnerabilities || []).join('; ')}.
Answer what-if questions with specific, actionable insights referencing segment scores. Be concise.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: message },
  ];

  try {
    const completion = await withRetry(() =>
      client.chat.completions.create({
        model: MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 1024,
      })
    );

    return completion.choices[0].message.content;
  } catch (err) {
    console.error('OpenRouter chat error:', err.message);
    throw new Error(`Failed to process chat: ${err.message}`);
  }
}

module.exports = { parseSupplyChain, analyzeRisks, chatWithContext };
