const express = require("express");
const productImagesController = require("../controllers/productImages");
const router = express.Router();
const productController = require("../controllers/products");

router
  .post("/", productController.createProduct)
  .get("/", productController.getProducts)
  .put("/:id", productController.updateProduct)
  .delete("/:id", productController.deleteProduct);

module.exports = router;
