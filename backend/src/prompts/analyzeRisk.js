/**
 * Response schema for Vertex AI structured output.
 * Follows the OpenAPI 3.0 subset supported by Gemini.
 */
const reportResponseSchema = {
  type: 'OBJECT',
  properties: {
    overallScore: {
      type: 'NUMBER',
      description: 'Overall supply chain risk score from 0 (no risk) to 100 (extreme risk)',
    },
    riskLevel: {
      type: 'STRING',
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      description: 'Categorical risk level',
    },
    segments: {
      type: 'ARRAY',
      description: 'Risk analysis per supply chain segment',
      items: {
        type: 'OBJECT',
        properties: {
          from: { type: 'STRING' },
          to: { type: 'STRING' },
          mode: { type: 'STRING', enum: ['sea', 'air', 'road', 'rail', 'multimodal'] },
          product: { type: 'STRING' },
          risks: {
            type: 'OBJECT',
            properties: {
              geopolitical: { type: 'NUMBER', description: 'Score 1-10' },
              weather: { type: 'NUMBER', description: 'Score 1-10' },
              infrastructure: { type: 'NUMBER', description: 'Score 1-10' },
              supplierDependency: { type: 'NUMBER', description: 'Score 1-10' },
              regulatory: { type: 'NUMBER', description: 'Score 1-10' },
            },
            required: ['geopolitical', 'weather', 'infrastructure', 'supplierDependency', 'regulatory'],
          },
          segmentScore: { type: 'NUMBER', description: 'Segment risk score 0-100' },
          summary: { type: 'STRING', description: '2 sentence risk summary for this segment' },
        },
        required: ['from', 'to', 'mode', 'product', 'risks', 'segmentScore', 'summary'],
      },
    },
    vulnerabilities: {
      type: 'ARRAY',
      description: 'Top 5 specific vulnerabilities',
      items: { type: 'STRING' },
    },
    recommendations: {
      type: 'ARRAY',
      description: 'Top 5 actionable recommendations',
      items: { type: 'STRING' },
    },
    industryContext: {
      type: 'STRING',
      description: 'Paragraph about industry-typical risks for this supply chain',
    },
  },
  required: ['overallScore', 'riskLevel', 'segments', 'vulnerabilities', 'recommendations', 'industryContext'],
};

/**
 * Prompt template for comprehensive risk analysis.
 */
function getAnalyzeRiskPrompt(segments) {
  return `You are a senior global supply chain risk consultant. Analyze the following supply chain segments and provide a comprehensive risk assessment.

Score each risk dimension from 1 (lowest risk) to 10 (highest risk).
Calculate an overall risk score from 0 to 100.
Assign a riskLevel: LOW (0-25), MEDIUM (26-50), HIGH (51-75), CRITICAL (76-100).

Base your analysis on real-world knowledge of:
- Geopolitical tensions, sanctions, and trade conflicts
- Weather patterns, climate risks, and natural disaster exposure
- Infrastructure quality, port congestion, and transport reliability
- Supplier concentration and single-source dependency risks
- Regulatory compliance, customs complexity, and trade barriers

Provide exactly 5 specific vulnerabilities and 5 specific actionable recommendations.
Include a paragraph of industry context about typical risks for this type of supply chain.

Supply Chain Segments:
${JSON.stringify(segments, null, 2)}`;
}

module.exports = { getAnalyzeRiskPrompt, reportResponseSchema };
