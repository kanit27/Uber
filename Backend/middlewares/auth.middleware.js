const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const BlackListToken = require('../models/blackListToken.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ message: 'Login first' });
    }

    try {
        // Check if the token is blacklisted
        const isBlacklisted = await BlackListToken.findOne({ token });
        if (isBlacklisted) {
            console.log('Token is blacklisted:', token);
            return res.status(401).json({ message: 'Login first' });
        }

        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Find the user
        const user = await userModel.findById(decoded._id);
        console.log('User found:', user);

        // If user doesn't exist or their token is removed, deny access
        if (!user ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Login first' });
    }
};
