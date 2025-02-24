const captionModel = require('../models/caption.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const captionService = require('../services/caption.service');
const { validationResult } = require('express-validator');

module.exports.registerCaption = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {fullname, email, password, vehicle} = req.body;
        
        const isCaptionAlreadyExists = await captionModel.findOne({ email });
        if (isCaptionAlreadyExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        const caption = await captionService.createCaption({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        });
        const token = caption.generateAuthToken();
        res.status(201).json({ token, caption });
    }
    catch (error) {
        next(error);
    }
}