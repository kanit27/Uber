const captionModel = require('../models/caption.model');

exports.createCaption = async ({firstname, lastname, email, password, color, plate, capacity, vehicleType}) => {
    if(!firstname || !email || !password || !firstname || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    const captionService = await captionModel.create({
        fullname:{
            firstname,
            lastname,
        },
        email,
        password,
        vehicle:{
            color,
            plate,
            capacity,
            vehicleType
        }
    });
    return captionService;
};
