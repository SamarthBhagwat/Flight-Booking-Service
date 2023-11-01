class BookingService{

    async executeBussinessLogic(){
        console.log("Bussiness logic executed successfuly");
        console.log("passing request to repository for db operation");
        console.log("Got response from db");
        return "Successfully executed all the operations and the entire workflow is completed";
    }

}

module.exports = BookingService;