const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM passengers", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const data = results.map(p => ({ ...p, total_bookings: 0, bookings: [] }));
    res.json({ success: true, data });
  });
});

router.get("/stats/summary", (req, res) => {
  db.query("SELECT COUNT(*) AS total_passengers, COUNT(DISTINCT nationality) AS nationalities FROM passengers", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: { ...results[0], total_bookings: 0 } });
  });
});

router.post("/", (req, res) => {
  const { name, passport_id, nationality, email, phone } = req.body;
  if (!name || !passport_id || !nationality) {
    return res.status(400).json({ success: false, message: "Name, Passport ID, and Nationality are required" });
  }
  db.query(
    "INSERT INTO passengers (name, passport_id, nationality, email, phone) VALUES (?, ?, ?, ?, ?)",
    [name, passport_id, nationality, email, phone],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Passenger added successfully", id: results.insertId });
    }
  );
});

module.exports = router;