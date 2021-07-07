const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");

router
  .post("/", categoryController.createCategory)
  .get("/", categoryController.getCategory)
  .put("/:id", categoryController.updateCategory)
  .delete("/:id", categoryController.deleteCategory);

module.exports = router;
