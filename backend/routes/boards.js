import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get all boards for a user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [boards] = await pool.execute(
      'SELECT * FROM boards WHERE user_id = ?',
      [req.user.id]
    );
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new board
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO boards (title, user_id) VALUES (?, ?)',
      [title, req.user.id]
    );
    res.status(201).json({ id: result.insertId, title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 