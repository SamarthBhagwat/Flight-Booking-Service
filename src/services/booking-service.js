const axios = require('axios');
const db = require('../models');
const { FLIGHT_SERVICE } = require('../config/server-config')

class BookingService{

    async createBooking(data){
        try {
            const result = await db.sequelize.transaction(async() => {
                const flight = await axios.get(FLIGHT_SERVICE + `/api/v1/flights/${data.flightId}`);
                console.log(flight);
                return true;
            });
            return result;    
        } catch (error) {
            
        }
        
    }

}

module.exports = BookingService;