const axios = require('axios');
const { StatusCodes } = require('http-status-codes')
const db = require('../models');
const { FLIGHT_SERVICE } = require('../config/server-config');
const AppError = require('../utils/error/app-error');
const BookingRepository = require('../repositories/booking-repository');

const bookingRepository = new BookingRepository();

class BookingService{

    async createBooking(data){
        const transaction = await db.sequelize.transaction();
        try {
            // Making API call to flight service to get the corresponding flights details that the user want to book 
            const getFlightResponse = await axios.get(FLIGHT_SERVICE + `/api/v1/flights/${data.flightId}`);
            const flightData = getFlightResponse.data.data;

            // Checking whether sufficient seats are available or not 
            if(data.noOfSeats > flightData.totalSeats){
                throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
            }

            // Calculating total billing amount 
            const totalBillingAmount = flightData.price * data.noOfSeats;
            console.log("Total billing amount is ", totalBillingAmount);

            // Create booking
            const bookingPayload = {...data , totalCost: totalBillingAmount};
            const booking = await bookingRepository.createBooking(bookingPayload, transaction);

            // Update seats 
            // During the updateSeats function in flight service, we are creating a new transaction object and not passing the same 
            // transaction object as above, this will not create an issue as if that transaction object fails , it will rollback and the
            // error will be thrown as a result, this transaction object will also fail. 
            const updateSeatsResponse = await axios.patch(FLIGHT_SERVICE + `/api/v1/flights/${data.flightId}/seats` , {
                'seats': data.noOfSeats
            });
            console.log("Update seats response ", updateSeatsResponse.data);

            await transaction.commit();
            return booking;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        
    }

}

module.exports = BookingService;