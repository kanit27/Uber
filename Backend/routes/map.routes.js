const express = require('express')
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');


router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }).withMessage("Address is required"),  
  authMiddleware.authUser,
  mapController.getCoordinates
);

module.exports = router;

