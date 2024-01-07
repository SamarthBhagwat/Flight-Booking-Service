const express = require('express');
const router = express.Router();

const { BookingMiddleware } = require('../../../middlewares');
const { BookingController } = require('../../../controllers');

const bookingMiddleware = new BookingMiddleware();
const bookingController = new BookingController();

router.post('/', bookingMiddleware.validateCreateBookingRequest, bookingController.createBooking);

router.post('/payments', bookingController.makePayment);

module.exports = router;