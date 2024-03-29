const { BookingService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/response');
const { StatusCodes } = require('http-status-codes');

const bookingService = new BookingService();
const inMemoryDB = {};

class BookingController{

    async createBooking(req, res){
        try {
            const data = {};
            data.flightId = req.body.flightId;
            data.userId = req.body.userId;
            data.noOfSeats = req.body.noOfSeats;
            const response = await bookingService.createBooking(data);
            console.log(response);
            SuccessResponse.data = response;
            res.status(StatusCodes.OK).send(SuccessResponse);
        } catch (error) {
            console.log(error);
            ErrorResponse.error = error;
            if(error.statusCode){
                res.status(error.statusCode).send(ErrorResponse);
            }
            else{
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ErrorResponse);
            }
        }
        
    }
    
    async makePayment(req, res){
        try {
            const idempotencyKey = req.headers['x-idempotency-key'];
            if(!idempotencyKey){
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Idempotency key missing'});
            }
            if(inMemoryDB[idempotencyKey]){
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Cannot retry on a succesful payment'});
            }
            const data = {};
            data.bookingId = req.body.bookingId;
            data.userId = req.body.userId;
            data.totalCost = req.body.totalCost;
            const response = await bookingService.makePayment(data);
            console.log(response);
            inMemoryDB[idempotencyKey] = idempotencyKey;
            SuccessResponse.data = response;
            res.status(StatusCodes.OK).send(SuccessResponse);
        } catch (error) {
            console.log(error);
            ErrorResponse.error = error;
            if(error.statusCode){
                res.status(error.statusCode).send(ErrorResponse);
            }
            else{
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ErrorResponse);
            }
        }
        
    }
}


module.exports = BookingController;