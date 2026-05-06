// =====================================================================
// TrailTales server entrypoint
// Single Express process that:
//   1. Connects to MongoDB Atlas
//   2. Exposes the REST API under /api
//   3. Serves the built React app (client/dist) for everything else
//      -> No CORS needed between frontend and backend in production,
//         because they share the same origin.
// =====================================================================

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

// ----- Security & basics -----
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ----- CORS (single source: env var) -----
// CORS_ORIGIN is the ONLY place where allowed origins are configured.
// When the EC2 public IP changes, just edit .env and restart the container.
const rawOrigins = (process.env.CORS_ORIGIN || '*').trim();
const corsOptions = rawOrigins === '*'
  ? { origin: true, credentials: true }
  : {
      origin: rawOrigins.split(',').map(s => s.trim()).filter(Boolean),
      credentials: true,
    };
app.use(cors(corsOptions));

// ----- Basic rate limit on auth -----
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

// ----- API routes -----
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/posts', postRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'TrailTales', time: new Date().toISOString() });
});

// ----- Serve React build (single-container deploy) -----
const clientDist = path.resolve(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ----- Error handler -----
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// ----- Start -----
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`TrailTales server running on port ${PORT} (${process.env.NODE_ENV || 'dev'})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
