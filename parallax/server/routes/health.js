import express from 'express';
import pool from '../database/config.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Body Metrics
router.get('/metrics', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM body_metrics WHERE user_id = $1 ORDER BY date DESC LIMIT 100',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

router.post('/metrics', async (req, res) => {
  try {
    const { date, weight, body_fat, muscle_mass, measurements, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO body_metrics (user_id, date, weight, body_fat, muscle_mass, measurements, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, date, weight, body_fat, muscle_mass, measurements, notes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save metrics' });
  }
});

// Workouts
router.get('/workouts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE user_id = $1 ORDER BY date DESC LIMIT 100',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

router.post('/workouts', async (req, res) => {
  try {
    const { date, type, exercises, duration, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO workouts (user_id, date, type, exercises, duration, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, date, type, exercises, duration, notes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save workout' });
  }
});

// Meals
router.get('/meals', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM meals WHERE user_id = $1 ORDER BY date DESC LIMIT 100',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

router.post('/meals', async (req, res) => {
  try {
    const { date, meal_type, foods, protein, carbs, fat, fiber, calories, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO meals (user_id, date, meal_type, foods, protein, carbs, fat, fiber, calories, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [req.user.id, date, meal_type, foods, protein, carbs, fat, fiber, calories, notes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save meal' });
  }
});

// Habits
router.get('/habits', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

router.post('/habits', async (req, res) => {
  try {
    const { name, frequency } = req.body;
    const result = await pool.query(
      `INSERT INTO habits (user_id, name, frequency) VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, name, frequency]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

router.patch('/habits/:id/complete', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE habits SET streak = streak + 1, last_completed = CURRENT_DATE 
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update habit' });
  }
});

export default router;
