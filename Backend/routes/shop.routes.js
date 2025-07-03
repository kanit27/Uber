const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");

router.post("/register", shopController.registerShop);
router.post("/login", shopController.loginShop);
router.get("/", shopController.getAllShops);
router.get("/:shopId", shopController.getShopById);
router.post("/products", shopController.addOrUpdateProducts);

module.exports = router;