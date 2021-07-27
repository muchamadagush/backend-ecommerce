const express = require('express');
const router = express.Router();

// routes
const productRoutes = require('./products');
const categoryRoutes = require('./category');
const orderRoutes = require('./orders');
const colorRoutes = require('./colors');
const usersRoutes = require('./users');

router
  .use('/files', express.static(__dirname + '/src/assets/images'))
  .use('/products', productRoutes)
  .use('/category', categoryRoutes)
  .use('/orders', orderRoutes)
  .use('/colors', colorRoutes)
  .use('/users', usersRoutes)

module.exports = router