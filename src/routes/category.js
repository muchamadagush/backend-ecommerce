const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/category');
const auth = require('../middleware/auth');

router
  .post('/', auth, categoryController.createCategory)
  .get('/', categoryController.getCategory)
  .get('/:id', categoryController.getCategoryById)
  .put('/:id', auth, categoryController.updateCategory)
  .delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
