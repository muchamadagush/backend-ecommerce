const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/category');

router
  .post('/', categoryController.createCategory)
  .get('/', categoryController.getCategory)
  .get('/:id', categoryController.getCategoryById)
  .put('/:id', categoryController.updateCategory)
  .delete('/:id', categoryController.deleteCategory);

module.exports = router;
