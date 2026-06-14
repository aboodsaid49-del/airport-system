const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all flights
router.get('/', (req, res) => {
    db.query('SELECT * FROM flights', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get single flight
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM flights WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Flight not found' });
        res.json(results[0]);
    });
});

// Add new flight
router.post('/', (req, res) => {
    const { flight_number, origin, destination, departure_time, arrival_time, capacity, gate } = req.body;
    db.query(
        'INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, capacity, gate) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [flight_number, origin, destination, departure_time, arrival_time, capacity, gate],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Flight added successfully', id: results.insertId });
        }
    );
});

// Update flight
router.put('/:id', (req, res) => {
    const { status } = req.body;
    db.query('UPDATE flights SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Flight updated successfully' });
    });
});

// Delete flight
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM flights WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Flight deleted successfully' });
    });
});

module.exports = router;