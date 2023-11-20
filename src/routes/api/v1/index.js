const express = require('express');
const router = express.Router();

const bookingRoute = require('./booking');

router.use('/bookings', bookingRoute);

module.exports = router;