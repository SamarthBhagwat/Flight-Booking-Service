class BookingMiddleware{

    validateGetRequest(req, res, next){
        console.log("Middleware");
        next();
    }

}


module.exports = BookingMiddleware;