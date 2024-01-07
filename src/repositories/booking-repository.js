const BasicCRUDRepository = require('./crud-repository');
const {Booking} = require('../models');
const db = require('../models');

class BookingRepository extends BasicCRUDRepository{

    constructor(){
       super(Booking); 
    }

    async createBooking(data, transaction){
        const response = await this.create(data, {transaction: transaction});
        return response;
    }
}

module.exports = BookingRepository;