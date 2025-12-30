import express from 'express';
import pool from '../database/config.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// Countries
router.get('/countries', async (req, res) => {
  try {
    const { region, search } = req.query;
    let query = 'SELECT * FROM countries';
    const params = [];
    
    if (region) {
      query += ' WHERE region = $1';
      params.push(region);
    } else if (search) {
      query += ' WHERE name ILIKE $1';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY name';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

router.get('/countries/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM countries WHERE id = $1',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch country' });
  }
});

// Pet Requirements
router.get('/countries/:id/pets', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pet_requirements WHERE country_id = $1',
      [req.params.id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pet requirements' });
  }
});

// Country Comparisons
router.get('/comparisons', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM country_comparisons WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comparisons' });
  }
});

router.post('/comparisons', async (req, res) => {
  try {
    const { name, country_ids, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO country_comparisons (user_id, name, country_ids, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, name, country_ids, notes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save comparison' });
  }
});

router.delete('/comparisons/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM country_comparisons WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comparison' });
  }
});

// Relocation Plans
router.get('/relocation-plans', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rp.*, c.name as country_name 
       FROM relocation_plans rp
       JOIN countries c ON rp.target_country_id = c.id
       WHERE rp.user_id = $1 
       ORDER BY rp.target_date`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch relocation plans' });
  }
});

router.post('/relocation-plans', async (req, res) => {
  try {
    const { target_country_id, target_date, savings_target, current_savings, monthly_contribution, checklist } = req.body;
    const result = await pool.query(
      `INSERT INTO relocation_plans (user_id, target_country_id, target_date, savings_target, current_savings, monthly_contribution, checklist)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, target_country_id, target_date, savings_target, current_savings, monthly_contribution, checklist]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create relocation plan' });
  }
});

router.put('/relocation-plans/:id', async (req, res) => {
  try {
    const { current_savings, monthly_contribution, checklist } = req.body;
    const result = await pool.query(
      `UPDATE relocation_plans 
       SET current_savings = $1, monthly_contribution = $2, checklist = $3
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [current_savings, monthly_contribution, checklist, req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update relocation plan' });
  }
});

// Pets
router.get('/pets', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pets WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

router.post('/pets', async (req, res) => {
  try {
    const { name, type, breed, age, weight, medical_records } = req.body;
    const result = await pool.query(
      `INSERT INTO pets (user_id, name, type, breed, age, weight, medical_records)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, name, type, breed, age, weight, medical_records]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add pet' });
  }
});

export default router;
