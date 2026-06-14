const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all airports
router.get('/', (req, res) => {
  db.query('SELECT * FROM airports', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add airport
router.post('/', (req, res) => {
  const { name, code, city, country } = req.body;
  db.query(
    'INSERT INTO airports (name, code, city, country) VALUES (?, ?, ?, ?)',
    [name, code, city, country],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Airport added successfully', id: results.insertId });
    }
  );
});

// Delete airport
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM airports WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Airport deleted successfully' });
  });
});

module.exports = router;