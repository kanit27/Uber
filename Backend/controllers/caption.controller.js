const captionModel = require('../models/caption.model');
const captionService = require('../services/caption.service');
const { validationResult } = require('express-validator');
const BlackListToken = require('../models/blackListToken.model');

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
        
        

        const caption = await captionService.createCaption({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
            vehicleModel: vehicle.vehicleModel
        });
        const token = caption.generateAuthToken();
        res.status(201).json({ token, caption });
    }
    catch (error) {
        next(error);
    }
}

module.exports.loginCaption = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const caption = await captionModel
            .findOne({ email })
            .select('+password');
            
        if (!caption) {
            return res.status(404).json({ message: 'Caption not found' });
        }
        
        const isMatch = await caption.comparePassword;
        
        if (!isMatch) {
            return res.status(400).json({ message: 'password not matched' });
        }
        
        const token = caption.generateAuthToken();
        res.cookie('token', token);
        res.status(200).json({ token, caption });
    }
    catch (error) {
        next(error);
    }
}

module.exports.getCaptionProfile = async (req, res, next) => {
    try {
        res.status(200).json(req.caption);
    }
    catch (error) {
        next(error);
    }
}

module.exports.logoutCaption = async (req, res) => {   
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    const blacklistedToken = new BlackListToken({ token });
    await blacklistedToken.save();

    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out' });
    }
    catch (error) {
        next(error);
    }
}