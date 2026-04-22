const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { parseSupplyChain, analyzeRisks } = require('../services/gemini');
const { saveReport } = require('../services/firestore');

const router = express.Router();

/**
 * POST /api/analyze
 * Accepts { description: string }
 * 1. Parse supply chain description into segments (Gemini)
 * 2. Analyse risks for each segment (Gemini + structured output)
 * 3. Save report to Firestore
 * 4. Return full report JSON
 */
router.post('/', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'Supply chain description is required.' });
    }

    // Step 1 — Parse
    console.log('⏳ Parsing supply chain description…');
    const segments = await parseSupplyChain(description);

    // Step 2 — Analyse
    console.log(`⏳ Analysing ${segments.length} segments…`);
    const analysis = await analyzeRisks(segments);

    // Step 3 — Build report
    const report = {
      id: uuidv4(),
      ...analysis,
      rawDescription: description,
      createdAt: new Date().toISOString(),
    };

    // Step 4 — Persist
    await saveReport(report);
    console.log(`✅ Report ${report.id} saved (score: ${report.overallScore})`);

    res.json(report);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze supply chain.', details: error.message });
  }
});

module.exports = router;
