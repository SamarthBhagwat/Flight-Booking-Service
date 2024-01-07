const axios = require('axios');
const { StatusCodes } = require('http-status-codes')
const db = require('../models');
const { FLIGHT_SERVICE } = require('../config/server-config');
const AppError = require('../utils/error/app-error');
const BookingRepository = require('../repositories/booking-repository');
const {BOOKING_STATUS} = require('../utils/common/enum');

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
            await axios.patch(FLIGHT_SERVICE + `/api/v1/flights/${data.flightId}/seats` , {
                'seats': data.noOfSeats
            });
            // console.log("Update seats response ", updateSeatsResponse.data);

            await transaction.commit();
            return booking;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        
    }

    // consider this as a separate microservice dealing with the payments
    async makePayment(data){
        // data will be about booking id, user id and amount
        const transaction = await db.sequelize.transaction();
        try {
            // in the real-case, this will be an API call to booking service using axios
            const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
            if(bookingDetails.status == BOOKING_STATUS.CANCELLED){
                throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
            }
            const bookingTime = new Date(bookingDetails.createdAt);
            const currentTime = new Date();

            // If the time taken for making payment is greater than 5 mins, then make booking expired 
            if(currentTime - bookingTime > 300000){
                // await bookingRepository.update(data.bookingId, {status: BOOKING_STATUS.CANCELLED}, transaction);
                await this.cancelBooking(data.bookingId);
                throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
            }
            if(bookingDetails.totalCost != data.totalCost){ 
                throw new AppError('The amount of the payment does not match!', StatusCodes.BAD_REQUEST);
            }
            if(bookingDetails.userId != data.userId){
                throw new AppError('The user corresponding to the booking does not match!', StatusCodes.BAD_REQUEST);
            }

            // we assume here that payment is successful
            // this microservice will interact with a third-party payment solution to complete the payment 

            // update the status of the booking in the booking service
            await bookingRepository.update(data.bookingId, {status: BOOKING_STATUS.BOOKED}, transaction);
            await transaction.commit();
            return bookingDetails.reload();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } 

    async cancelBooking(bookingId){
        const transaction = await db.sequelize.transaction();
        try {
            const bookingDetails = await bookingRepository.get(bookingId, transaction);
            if(bookingDetails.status == BOOKING_STATUS.CANCELLED){
                await transaction.commit();
                return true;
            }

            // Cancel the booking, that is change the status of the booking to CANCELLED
            await bookingRepository.update(bookingId, {status: BOOKING_STATUS.CANCELLED}, transaction);

            // Once the status has been successfully updated to CANCELLED , we can go ahead and increase the no of seats which we had 
            // earlier reserved for the booking 
            await axios.patch(`${FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
                seats: bookingDetails.noOfSeats, 
                dec: 0
            });

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        
    }
}

module.exports = BookingService;