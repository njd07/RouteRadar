const { VertexAI } = require('@google-cloud/vertexai');

const { getParseChainPrompt } = require('../prompts/parseChain');
const { getAnalyzeRiskPrompt, reportResponseSchema } = require('../prompts/analyzeRisk');

let vertexAI;
let generativeModel;

/** Lazy-initialise the Vertex AI client. */
function initializeGemini() {
  vertexAI = new VertexAI({
    project: process.env.GCP_PROJECT_ID,
    location: process.env.GCP_LOCATION || 'us-central1',
  });

  generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
  });
}

function getModel() {
  if (!generativeModel) initializeGemini();
  return generativeModel;
}

// ──────────────────────────────────────────────
// Step 1 — Parse supply chain description
// ──────────────────────────────────────────────
async function parseSupplyChain(description) {
  const model = getModel();
  const prompt = getParseChainPrompt(description);

  const request = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  };

  try {
    const result = await model.generateContent(request);
    const text = result.response.candidates[0].content.parts[0].text;
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
  const model = getModel();
  const prompt = getAnalyzeRiskPrompt(segments);

  const request = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
      responseSchema: reportResponseSchema,
    },
  };

  try {
    const result = await model.generateContent(request);
    const text = result.response.candidates[0].content.parts[0].text;
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
  const model = getModel();

  const systemPrompt = `You are RouteRadar AI, a supply chain risk expert. The user's supply chain has been analyzed with an overall risk score of ${report.overallScore}/100 (${report.riskLevel}). Their supply chain has ${report.segments.length} segments: ${report.segments.map((s) => `${s.from} → ${s.to} via ${s.mode}`).join(', ')}. Key vulnerabilities: ${report.vulnerabilities.join('; ')}. Answer their what-if questions with specific insights. Reference specific segments and risk scores. Be concise.`;

  // Build multi-turn conversation: system context → previous turns → new message
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    {
      role: 'model',
      parts: [
        {
          text: "Understood. I have the full context of this supply chain analysis. I'm ready to answer your what-if questions with specific insights about segments, risk scores, and recommendations.",
        },
      ],
    },
    ...history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const request = {
    contents,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 1024,
    },
  };

  try {
    const result = await model.generateContent(request);
    return result.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw new Error(`Failed to process chat: ${error.message}`);
  }
}

module.exports = { parseSupplyChain, analyzeRisks, chatWithContext, initializeGemini };
