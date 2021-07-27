const express = require('express');

const router = express.Router();
const productController = require('../controllers/products');
const auth = require('../middleware/auth')

router
  .post('/', auth, productController.createProduct)
  .get('/', productController.getProducts)
  .put('/:id', auth, productController.updateProduct)
  .delete('/:id', auth, productController.deleteProduct)
  .get('/:id', productController.getProduct)

module.exports = router;
