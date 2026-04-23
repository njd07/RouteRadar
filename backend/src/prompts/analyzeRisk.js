/**
 * Prompt for Step 2: comprehensive risk analysis.
 * JSON structure is enforced natively by Gemini's responseSchema,
 * so this prompt focuses on scoring logic and real-time news integration.
 */
function getAnalyzeRiskPrompt(segments) {
  return `You are a senior global supply chain risk consultant with 20 years of experience.

Analyze the supply chain segments below and generate a comprehensive risk report.

SCORING RULES:
- overallScore: 0-25 = LOW, 26-50 = MEDIUM, 51-75 = HIGH, 76-100 = CRITICAL
- riskLevel must match overallScore range exactly
- Risk dimensions are scored 1-10 based on real-world knowledge of:
  * geopolitical: active conflicts, sanctions, political instability on this route
  * weather: seasonal weather risk, natural disaster history for this geography
  * infrastructure: port congestion, road quality, customs efficiency
  * supplierDependency: single-source risk, concentration risk
  * regulatory: trade restrictions, tariffs, border complexity
- segmentScore: weighted average of the 5 risk dimensions × 10
- estimatedImpact: If no cargo value is specified, output "N/A - Volume Required". If commodity type is known, give a proportionate range (e.g. "$10k–$50k for agricultural byproducts"). Never invent a specific large number without justification.
- CRITICAL: Each segment may contain a "realTimeNews" field with live news headlines. You MUST incorporate any disruptions, strikes, conflicts, or weather events mentioned in these headlines into your segment scores and your vulnerabilities/recommendations lists. This is what makes the analysis real-time.
- Provide EXACTLY 5 vulnerabilities and EXACTLY 5 recommendations
- vulnerabilities should be specific to these exact routes and products
- recommendations should be actionable and specific

CRITICAL INSTRUCTION: You must respond ONLY with raw, valid JSON. Do not include markdown formatting, backticks (\`\`\`json), or any conversational text outside of the JSON object. The JSON must exactly match this structure:

{
  "overallScore": <number 0-100>,
  "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "estimatedImpact": "<string>",
  "segments": [
    {
      "from": "<string>",
      "to": "<string>",
      "mode": "<string>",
      "product": "<string>",
      "risks": {
        "geopolitical": <number 1-10>,
        "weather": <number 1-10>,
        "infrastructure": <number 1-10>,
        "supplierDependency": <number 1-10>,
        "regulatory": <number 1-10>
      },
      "segmentScore": <number 0-100>,
      "summary": "<2 sentence risk summary>"
    }
  ],
  "vulnerabilities": ["<string>", "<string>", "<string>", "<string>", "<string>"],
  "recommendations": ["<string>", "<string>", "<string>", "<string>", "<string>"],
  "industryContext": "<paragraph>"
}

Supply Chain Segments (may include real-time news context):
${JSON.stringify(segments, null, 2)}`;
}

module.exports = { getAnalyzeRiskPrompt };
