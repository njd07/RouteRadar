const express = require('express');
const { listReports, getReport } = require('../services/firestore');

const router = express.Router();

/**
 * GET /api/reports
 * Returns a summary list of all saved reports (most recent first).
 */
router.get('/', async (req, res) => {
  try {
    const reports = await listReports();
    res.json(reports);
  } catch (error) {
    console.error('List reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports.', details: error.message });
  }
});

/**
 * GET /api/reports/:id
 * Returns the full report object for a given ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const report = await getReport(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }
    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to fetch report.', details: error.message });
  }
});

module.exports = router;
