const express = require('express');
const router = express.Router();

const bookingRoute = require('./booking');

router.use('/booking', bookingRoute);

module.exports = router;