const express = require('express');
const router = express.Router();

const {InfoController} = require('../../../controllers');

const bookingRoute = require('./booking');

router.use('/bookings', bookingRoute);

router.use('/info', InfoController.info);

module.exports = router;