const axios = require('axios');
const { StatusCodes } = require('http-status-codes')
const db = require('../models');
const { FLIGHT_SERVICE } = require('../config/server-config');
const AppError = require('../utils/error/app-error');

class BookingService{

    async createBooking(data){
        try {
            const result = await db.sequelize.transaction(async() => {
                const flight = await axios.get(FLIGHT_SERVICE + `/api/v1/flights/${data.flightId}`);
                const flightData = flight.data.data;
                if(data.noOfSeats > flightData.totalSeats){
                    throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
                }

                const totalBillingAmount = flightData.price * data.noOfSeats;
                console.log(totalBillingAmount);

                const response = await axios.patch(FLIGHT_SERVICE + `/api/v1/flights/${data.flightId}/seats` , {
                    'seats': data.noOfSeats
                });

                console.log(response.data);
                return response.data;
            });
            return result;    
        } catch (error) {
            throw error;
        }
        
    }

}

module.exports = BookingService;