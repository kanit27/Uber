const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const BlackListToken = require("../models/blackListToken.model");
const jwt = require("jsonwebtoken");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const isEmailExists = await userModel.findOne({ email });
    if (isEmailTaken) {
      return res.status(400).json({ message: 'Email already Exists' });
    }

    // 🔹 Create user (password is hashed automatically in the model)
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password,
    });

    // 🔹 Generate auth token
    const token = user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // 🔹 Find user by email
    const user = await userModel.findOne({ email}).select("+password");

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 🔹 Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 🔹 Generate auth token
    const token = user.generateAuthToken();
    res.cookie('token', token)

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
}

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res) => {
  try {
      const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);
      if (!token) {
          return res.status(400).json({ message: 'No token provided' });
      }

      // Decode token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded._id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      console.log('Before Logout:', user);

      // Blacklist the token
      await BlackListToken.create({ token });

      // Remove token from user model
      user.token = null;
      await user.save();

      console.log('After Logout:', await userModel.findById(decoded._id));

      // Clear cookie
      res.clearCookie('token', { httpOnly: true, secure: true });

      return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
      console.error('Logout Error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};