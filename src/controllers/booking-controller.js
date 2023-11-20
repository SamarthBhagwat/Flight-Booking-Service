const { BookingService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/response');
const { StatusCodes } = require('http-status-codes');

const bookingService = new BookingService();

class BookingController{

    async createBooking(req, res){
        try {
            const data = {};
            data.flightId = req.body.flightId;
            const response = await bookingService.createBooking(data);
            console.log(response);
            SuccessResponse.data = response;
            res.status(StatusCodes.OK).send(SuccessResponse);
        } catch (error) {
            console.log(error);
            ErrorResponse.error = error;
            res.status(error.statusCode).send(ErrorResponse);
        }
        
    }
    
}


module.exports = BookingController;