const BasicCRUDRepository = require('./crud-repository');
const {Booking} = require('../models');
const db = require('../models');
const { StatusCodes } = require('http-status-codes');

class BookingRepository extends BasicCRUDRepository{

    constructor(){
       super(Booking); 
    }

    async createBooking(data, transaction){
        const response = await this.create(data, {transaction: transaction});
        return response;
    }

    async get(data, transaction){
        const response = await this.model.findByPk(data, {transaction : transaction});
        if(!response){
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction){
        const response = await this.model.update(data, {
            where:{
                id:id
            }
        }, {transaction: transaction});
        return response;
    }
}

module.exports = BookingRepository;