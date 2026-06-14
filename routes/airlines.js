const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM airlines', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { name, code, country } = req.body;
  db.query(
    'INSERT INTO airlines (name, code, country) VALUES (?, ?, ?)',
    [name, code, country],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Airline added successfully', id: results.insertId });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM airlines WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Airline deleted successfully' });
  });
});

module.exports = router;