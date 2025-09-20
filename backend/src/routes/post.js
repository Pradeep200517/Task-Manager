const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const pool = require('../config/db');

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, image } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO posts (author_id, title, content, tags, image, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, author_id, title, content, tags, image, updated_by, created_at, updated_at`,
      [req.user.id, title, content, tags || [], image || '', req.user.id]
    );
    const post = rows[0];
    await pool.query('INSERT INTO post_audits (post_id, actor_id, action) VALUES ($1, $2, $3)', [post.id, req.user.id, 'created']);
    const shaped = {
      _id: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      image: post.image,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: { _id: post.author_id, name: req.user.name }
    };
    res.json(shaped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.title, p.content, p.tags, p.image, p.created_at, p.updated_at,
              u.id as author_id, u.name as author_name,
              ub.id as updated_by_id, ub.name as updated_by_name
       FROM posts p
       JOIN users u ON u.id = p.author_id
       LEFT JOIN users ub ON ub.id = p.updated_by
       ORDER BY p.created_at DESC`);
    const shaped = rows.map(p => ({
      _id: p.id,
      title: p.title,
      content: p.content,
      tags: p.tags,
      image: p.image,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      author: { _id: p.author_id, name: p.author_name },
      lastEditedBy: p.updated_by_id ? { _id: p.updated_by_id, name: p.updated_by_name } : null
    }));
    res.json(shaped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.title, p.content, p.tags, p.image, p.created_at, p.updated_at,
              u.id as author_id, u.name as author_name,
              ub.id as updated_by_id, ub.name as updated_by_name
       FROM posts p JOIN users u ON u.id = p.author_id
       LEFT JOIN users ub ON ub.id = p.updated_by
       WHERE p.id = $1`, [req.params.id]);
    const p = rows[0];
    if (!p) return res.status(404).json({ message: 'Post not found' });
    const shaped = {
      _id: p.id,
      title: p.title,
      content: p.content,
      tags: p.tags,
      image: p.image,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      author: { _id: p.author_id, name: p.author_name },
      lastEditedBy: p.updated_by_id ? { _id: p.updated_by_id, name: p.updated_by_name } : null
    };
    res.json(shaped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post (only author)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags, image } = req.body;
    const { rows: ownerRows } = await pool.query('SELECT author_id FROM posts WHERE id = $1', [req.params.id]);
    const own = ownerRows[0];
    if (!own) return res.status(404).json({ message: 'Post not found' });
    if (own.author_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { rows } = await pool.query(
      `UPDATE posts SET 
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        tags = COALESCE($3, tags),
        image = COALESCE($4, image),
        updated_by = $6,
        updated_at = NOW()
       WHERE id = $5
       RETURNING id, author_id, title, content, tags, image, updated_by, created_at, updated_at`,
      [title, content, tags, image, req.params.id, req.user.id]
    );
    const p = rows[0];
    await pool.query('INSERT INTO post_audits (post_id, actor_id, action) VALUES ($1, $2, $3)', [p.id, req.user.id, 'updated']);
    const shaped = {
      _id: p.id,
      title: p.title,
      content: p.content,
      tags: p.tags,
      image: p.image,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      author: { _id: p.author_id, name: req.user.name },
      lastEditedBy: { _id: req.user.id, name: req.user.name }
    };
    res.json(shaped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (only author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows: ownerRows } = await pool.query('SELECT author_id FROM posts WHERE id = $1', [req.params.id]);
    const own = ownerRows[0];
    if (!own) return res.status(404).json({ message: 'Post not found' });
    if (own.author_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    await pool.query('INSERT INTO post_audits (post_id, actor_id, action) VALUES ($1, $2, $3)', [req.params.id, req.user.id, 'deleted']);
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
