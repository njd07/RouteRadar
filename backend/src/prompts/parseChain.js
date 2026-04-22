/**
 * Prompt template for extracting supply chain segments from plain English.
 */
function getParseChainPrompt(description) {
  return `You are a supply chain analyst. Extract all route segments from the following supply chain description.

Return ONLY a valid JSON array. Each segment object must have these fields:
- "from": starting location or source (string)
- "to": destination (string)
- "mode": transport mode — one of: "sea", "air", "road", "rail", "multimodal" (string)
- "product": what is being transported (string)
- "region": geographic region(s) involved (string)

Be precise and extract every distinct leg of the supply chain.

Description:
${description}`;
}

module.exports = { getParseChainPrompt };
