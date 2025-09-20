const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const pool = require('../config/db');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1', [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by id with posts
router.get('/:id', async (req, res) => {
  try {
    const { rows: users } = await pool.query('SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1', [req.params.id]);
    const user = users[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { rows: posts } = await pool.query('SELECT id, title, content, tags, image, created_at, updated_at FROM posts WHERE author_id = $1 ORDER BY created_at DESC', [user.id]);
    const shapedPosts = posts.map(p => ({ _id: p.id, title: p.title, content: p.content, tags: p.tags, image: p.image, createdAt: p.created_at, updatedAt: p.updated_at }));
    res.json({ user: { id: user.id, name: user.name, email: user.email }, posts: shapedPosts });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile (name, bio, avatar)
router.put('/me', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const { rows } = await pool.query('UPDATE users SET name = COALESCE($1, name), updated_at = NOW() WHERE id = $2 RETURNING id, name, email', [name, req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
