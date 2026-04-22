const { GoogleGenAI } = require('@google/genai');

const { getParseChainPrompt } = require('../prompts/parseChain');
const { getAnalyzeRiskPrompt, reportResponseSchema } = require('../prompts/analyzeRisk');

// Initialise once at module load — API key from env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.5-flash';

// ──────────────────────────────────────────────
// Step 1 — Parse supply chain description
// ──────────────────────────────────────────────
async function parseSupplyChain(description) {
  const prompt = getParseChainPrompt(description);

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini parseSupplyChain error:', error);
    throw new Error(`Failed to parse supply chain: ${error.message}`);
  }
}

// ──────────────────────────────────────────────
// Step 2 — Analyse risks with structured output
// ──────────────────────────────────────────────
async function analyzeRisks(segments) {
  const prompt = getAnalyzeRiskPrompt(segments);

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: reportResponseSchema,
      },
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini analyzeRisks error:', error);
    throw new Error(`Failed to analyze risks: ${error.message}`);
  }
}

// ──────────────────────────────────────────────
// Chat — what-if scenario conversations
// ──────────────────────────────────────────────
async function chatWithContext(report, history, message) {
  const systemInstruction = `You are RouteRadar AI, a supply chain risk expert. The user's supply chain has been analyzed with an overall risk score of ${report.overallScore}/100 (${report.riskLevel}). Their supply chain has ${report.segments.length} segments: ${report.segments.map((s) => `${s.from} → ${s.to} via ${s.mode}`).join(', ')}. Key vulnerabilities: ${report.vulnerabilities.join('; ')}. Answer their what-if questions with specific insights. Reference specific segments and risk scores. Be concise.`;

  // Build multi-turn contents array from history + new message
  const contents = [
    ...history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.5,
        maxOutputTokens: 1024,
      },
    });

    return response.text;
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw new Error(`Failed to process chat: ${error.message}`);
  }
}

module.exports = { parseSupplyChain, analyzeRisks, chatWithContext };
