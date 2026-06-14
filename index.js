const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const db = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const passengersRoutes = require('./routes/passengers');
const airportRoutes = require('./routes/airports');
const airlineRoutes = require('./routes/airlines');

app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/passengers', passengersRoutes);
app.use('/api/airlines', airlineRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Abood EQ International Airport API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});