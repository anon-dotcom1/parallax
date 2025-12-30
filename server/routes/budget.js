import express from 'express';
import pool from '../database/config.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// Transactions
router.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 OR is_shared = true ORDER BY date DESC LIMIT 500',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const { date, amount, category, subcategory, type, is_shared, notes, receipt_url } = req.body;
    const result = await pool.query(
      `INSERT INTO transactions (user_id, date, amount, category, subcategory, type, is_shared, notes, receipt_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.id, date, amount, category, subcategory, type, is_shared, notes, receipt_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

router.delete('/transactions/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Budgets
router.get('/budgets', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM budgets WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

router.post('/budgets', async (req, res) => {
  try {
    const { category, monthly_limit, rollover } = req.body;
    const result = await pool.query(
      `INSERT INTO budgets (user_id, category, monthly_limit, rollover)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, category, monthly_limit, rollover]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

router.put('/budgets/:id', async (req, res) => {
  try {
    const { monthly_limit, rollover } = req.body;
    const result = await pool.query(
      `UPDATE budgets SET monthly_limit = $1, rollover = $2 
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [monthly_limit, rollover, req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Savings Goals
router.get('/savings-goals', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM savings_goals WHERE user_id = $1 ORDER BY priority, deadline',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch savings goals' });
  }
});

router.post('/savings-goals', async (req, res) => {
  try {
    const { name, target_amount, current_amount, deadline, priority } = req.body;
    const result = await pool.query(
      `INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline, priority)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, name, target_amount, current_amount || 0, deadline, priority]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create savings goal' });
  }
});

router.patch('/savings-goals/:id', async (req, res) => {
  try {
    const { current_amount } = req.body;
    const result = await pool.query(
      `UPDATE savings_goals SET current_amount = $1 
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [current_amount, req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update savings goal' });
  }
});

// Summary/Stats
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;
    
    const result = await pool.query(
      `SELECT 
        category,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income
       FROM transactions 
       WHERE (user_id = $1 OR is_shared = true)
       AND date BETWEEN $2 AND $3
       GROUP BY category`,
      [req.user.id, startDate, endDate]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

export default router;
