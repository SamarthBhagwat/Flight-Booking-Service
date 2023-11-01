class BookingController{

    passRequestToService(req, res){
        console.log("Controller");
        res.send("Success");
    }
    
}


module.exports = BookingController;