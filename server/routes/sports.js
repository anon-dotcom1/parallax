import express from 'express';
import pool from '../database/config.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// Training Sessions
router.get('/training', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM training_sessions WHERE user_id = $1 ORDER BY date DESC LIMIT 100',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch training sessions' });
  }
});

router.post('/training', async (req, res) => {
  try {
    const { date, sport, performance, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO training_sessions (user_id, date, sport, performance, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, date, sport, performance, notes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save training session' });
  }
});

// Competitions
router.get('/competitions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM competitions WHERE user_id = $1 ORDER BY date DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch competitions' });
  }
});

router.post('/competitions', async (req, res) => {
  try {
    const { date, event, results, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO competitions (user_id, date, event, results, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, date, event, results, notes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save competition' });
  }
});

// Recovery Logs
router.get('/recovery', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recovery_logs WHERE user_id = $1 ORDER BY date DESC LIMIT 100',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recovery logs' });
  }
});

router.post('/recovery', async (req, res) => {
  try {
    const { date, sleep_hours, sleep_quality, soreness, energy, stress, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO recovery_logs (user_id, date, sleep_hours, sleep_quality, soreness, energy, stress, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, date, sleep_hours, sleep_quality, soreness, energy, stress, notes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save recovery log' });
  }
});

export default router;
