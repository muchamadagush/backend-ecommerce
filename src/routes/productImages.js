const express = require("express");
const multer = require("multer");
const router = express.Router();
const productImagesController = require("../controllers/productImages");

router.post("/", productImagesController.createProductImages);

module.exports = router;
