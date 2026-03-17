import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic route to check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Basic route to check DB connection
app.get('/api/db-health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'Database is connected successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
