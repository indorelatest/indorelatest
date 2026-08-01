require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const seoCrawlerMiddleware = require('./middleware/seoCrawlerMiddleware');

// Route imports
const newsRoutes = require('./routes/newsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ─── Core Middleware ─────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://indorelatest.com',
    'https://www.indorelatest.com',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve local static upload directory (fallback when Cloudflare R2 is not configured)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Indore Latest API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes (MUST come before SEO middleware so /api/* is never intercepted) ─
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscribe', subscriberRoutes);

// ─── SEO Crawler Middleware (only for article page routes, not /api/*) ────────
app.use(seoCrawlerMiddleware);

// ─── Serve React SPA in Production ───────────────────────────────────────────
// In production the frontend dist is served by this Express server.
// Nginx proxies /api/* to Express and serves everything else statically.
// If Express is serving the SPA directly (no Nginx), uncomment these lines:
// const distPath = path.join(__dirname, '../dist');
// app.use(express.static(distPath));
// app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));

// ─── 404 Handler (API routes only — SPA routes handled by Nginx/static) ──────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
