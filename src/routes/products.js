const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");

router
  .post("/", productController.createProduct)
  .get("/", productController.getProducts)
  .put("/:id", productController.updateProduct)
  .delete("/:id", productController.deleteProduct)
  .get("/:id", productController.getProduct)

module.exports = router;
