const express = require('express');

const router = express.Router();
const productController = require('../controllers/products');
const auth = require('../middleware/auth')
const redisCache = require('../middleware/redis')

router
  .post('/', auth, productController.createProduct)
  .get('/', redisCache.hitCacheAllProduct, productController.getProducts)
  .put('/:id', auth, redisCache.clearRedisAllProduct, redisCache.clearRedisProductId, productController.updateProduct)
  .delete('/:id', auth, redisCache.clearRedisAllProduct, redisCache.clearRedisProductId, productController.deleteProduct)
  .get('/:id', redisCache.hitCacheProductId, productController.getProduct)

module.exports = router;
