const userModel = require("../models/user-model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { fullname, email, password } = req.body;
  
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
