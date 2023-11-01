const BasicCRUDRepository = require('./crud-repository');
const Booking = require('../models/booking');

class BookingRepository extends BasicCRUDRepository{

    constructor(){
       super(Booking); 
    }
}

module.exports = BookingRepository;