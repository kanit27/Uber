const Shop = require('../models/shop.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.registerShop = async (req, res) => {
  try {
    const { shopname, ownername, email, password, location } = req.body;
    if (!shopname || !ownername?.firstname || !email || !password || !location) {
      return res.status(400).json({ message: "All fields including location are required" });
    }
    const exists = await Shop.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email exists" });
    const hash = await bcrypt.hash(password, 10);
    const shop = await Shop.create({
      shopname,
      ownername,
      email,
      password: hash,
      location,
    });
    // Generate token after successful registration
    const token = jwt.sign({ id: shop._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      token,
      shop: { _id: shop._id, shopname, ownername, email, location: shop.location }
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
exports.loginShop = async (req, res) => {
  try {
    const { email, password } = req.body;
    const shop = await Shop.findOne({ email }).select('+password');
    if (!shop) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, shop.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: shop._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, shop: { _id: shop._id, shopname: shop.shopname, ownername: shop.ownername, email: shop.email } });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all shops (for user map)
exports.getAllShops = async (req, res) => {
  const shops = await Shop.find({}, 'shopname ownername location isOpen');
  res.json({ success: true, shops });
};

// Get shop by ID (with products)
exports.getShopById = async (req, res) => {
  const shop = await Shop.findById(req.params.shopId);
  if (!shop) return res.status(404).json({ message: "Shop not found" });
  res.json({ shop });
};

// Add or update products (shopkeeper)
exports.addOrUpdateProducts = async (req, res) => {
  const { shopId, products } = req.body;
  if (!shopId || !Array.isArray(products)) return res.status(400).json({ message: "Invalid data" });
  const shop = await Shop.findById(shopId);
  if (!shop) return res.status(404).json({ message: "Shop not found" });
  shop.products = products;
  await shop.save();
  res.json({ message: "Products updated", products: shop.products });
};