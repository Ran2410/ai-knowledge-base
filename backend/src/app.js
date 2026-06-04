require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const documentsRouter = require('./routes/documents');
const conversationsRouter = require('./routes/conversations');

const app = express();

app.use(helmet());

app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'DELETE'],
}));

app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, try again later' },
});
app.use('/api/', limiter);

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: 'Chat rate limit exceeded' },
});
app.use('/api/documents/chat', chatLimiter);

app.use('/uploads', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

// Routes
app.use('/api/documents', documentsRouter);
app.use('/api/conversations', conversationsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
