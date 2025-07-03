const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: String,
  price: Number,
  stock: Number,
  isAvailable: { type: Boolean, default: true }
});

const shopSchema = new mongoose.Schema({
  shopname: { type: String, required: true },
  ownername: {
    firstname: { type: String, required: true },
    lastname: String
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  location: { type: [Number], required: true }, // [lat, lng]
  isOpen: { type: Boolean, default: false },
  products: [productSchema]
});

module.exports = mongoose.model('Shop', shopSchema);