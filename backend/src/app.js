const express = require('express');
const cors = require('cors');

const analyzeRoutes = require('./routes/analyze');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');

const app = express();

// --------------- Middleware ---------------
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

// --------------- Routes ---------------
app.use('/api/analyze', analyzeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);

// --------------- Health Check ---------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'routeradar-backend', timestamp: new Date().toISOString() });
});

module.exports = app;
