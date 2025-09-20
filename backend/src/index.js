require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Basic root and health endpoints
app.get('/', (_req, res) => {
  res.send('Task Manager API is running');
});

app.get('/healthz', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ status: 'error' });
  }
});

const PORT = process.env.PORT || 5000;

// Initialize PostgreSQL schema from init.sql if provided
const initSqlPath = path.join(__dirname, 'config', 'init.sql');
const runMigrations = async () => {
  if (fs.existsSync(initSqlPath)) {
    const sql = fs.readFileSync(initSqlPath, 'utf8');
    if (sql && sql.trim().length > 0) {
      await pool.query(sql);
      console.log('Database schema ensured');
    }
  }
};

runMigrations()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB init error:', err);
    process.exit(1);
  });
