import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { isSupabaseConfigured } from './config/supabase.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import clubLeadRoutes from './routes/clubLeadRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security & Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, '');
    const isAllowed =
      allowedOrigins.includes(normalizedOrigin) ||
      (process.env.ALLOW_VERCEL_PREVIEWS === 'true' && normalizedOrigin.endsWith('.vercel.app')) ||
      process.env.NODE_ENV !== 'production';

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Campus Club Explorer Backend',
    database: isSupabaseConfigured ? 'Supabase PostgreSQL (Live)' : 'In-Memory Fallback Active',
    supabaseConnected: isSupabaseConfigured,
    storageMode: process.env.NODE_ENV === 'production' || process.env.STORAGE_MODE === 'supabase' ? 'cloud_enforced' : 'development_fallback',
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/club-lead', clubLeadRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.method} ${req.baseUrl} not found`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server if not in test mode
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log('========================================================');
    console.log(`🚀 Campus Club Explorer API is running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   Clubs API:    http://localhost:${PORT}/api/clubs`);
    console.log(`   Database:     ${isSupabaseConfigured ? 'Supabase PostgreSQL (Live)' : 'In-Memory Storage Mode'}`);
    console.log('========================================================');
  });
}

export default app;
