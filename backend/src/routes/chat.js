const express = require('express');
const { chatWithContext } = require('../services/gemini');
const { getReport, saveChatMessage } = require('../services/firestore');

const router = express.Router();

/**
 * POST /api/chat
 * Accepts { reportId, message, history }
 * Fetches original report for context, sends full conversation to Gemini,
 * persists messages, and returns the AI reply.
 */
router.post('/', async (req, res) => {
  try {
    const { reportId, message, history = [] } = req.body;

    if (!reportId || !message) {
      return res.status(400).json({ error: 'reportId and message are required.' });
    }

    // Fetch report for context
    const report = await getReport(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // Get AI response
    const reply = await chatWithContext(report, history, message);

    // Persist both sides of the conversation
    await saveChatMessage(reportId, { role: 'user', content: message });
    await saveChatMessage(reportId, { role: 'model', content: reply });

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message.', details: error.message });
  }
});

module.exports = router;
