import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import sportsRoutes from './routes/sports.js';
import budgetRoutes from './routes/budget.js';
import escapePlanRoutes from './routes/escapePlan.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/escape-plan', escapePlanRoutes);

// Health check
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Parallax server running on port ${PORT}`);
});
