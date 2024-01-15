const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/error/app-error');
const { ErrorResponse , SuccessResponse} = require('../utils/response/')

class BookingMiddleware{

    async validateCreateBookingRequest(req, res, next){
        if(!req.body.flightId){
            let explanation = [];
            explanation.push("seats not found in request body");
            const appError = new AppError(explanation, StatusCodes.BAD_REQUEST);
            ErrorResponse.error = appError; 
            return res.status(ErrorResponse.error.statusCode).send(ErrorResponse);
        }
        next();
    }

}


module.exports = BookingMiddleware;