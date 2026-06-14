const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all bookings
router.get('/', (req, res) => {
    db.query(
        'SELECT bookings.*, users.full_name, flights.flight_number FROM bookings JOIN users ON bookings.user_id = users.id JOIN flights ON bookings.flight_id = flights.id',
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// Add new booking
router.post('/', (req, res) => {
    const { user_id, flight_id, seat_number } = req.body;
    db.query(
        'INSERT INTO bookings (user_id, flight_id, seat_number) VALUES (?, ?, ?)',
        [user_id, flight_id, seat_number],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Booking created successfully', id: results.insertId });
        }
    );
});

// Cancel booking
router.put('/:id', (req, res) => {
    db.query(
        'UPDATE bookings SET status = "cancelled" WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Booking cancelled successfully' });
        }
    );
});

module.exports = router;