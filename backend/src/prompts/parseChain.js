/**
 * Prompt for Step 1: parse supply chain description into segments.
 * The JSON schema is enforced natively by Gemini's responseSchema config,
 * so this prompt just needs to guide the extraction logic clearly.
 */
function getParseChainPrompt(description) {
  return `You are a supply chain analyst. Extract all distinct route segments (legs) from the supply chain description below.

For each leg, identify:
- from: the source location or country
- to: the destination location or country  
- mode: one of sea, air, road, rail, multimodal
- product: what is being transported
- region: the geographic region(s) involved

Extract EVERY hop. If the chain goes A → B → C, that is two segments.

CRITICAL INSTRUCTION: You must respond ONLY with raw, valid JSON. Do not include markdown formatting, backticks (\`\`\`json), or any conversational text outside of the JSON object. The output must be exactly:
{
  "segments": [
    { "from": "...", "to": "...", "mode": "...", "product": "...", "region": "..." }
  ]
}

Supply chain description:
${description}`;
}

module.exports = { getParseChainPrompt };
