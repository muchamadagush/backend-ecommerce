const express = require('express');

const router = express.Router();

// routes
const productRoutes = require('./products');
const categoryRoutes = require('./category');
const orderRoutes = require('./orders');
const colorRoutes = require('./colors');
const usersRoutes = require('./users');
const addressRoutes = require('./address');

router
  .use('/products', productRoutes)
  .use('/category', categoryRoutes)
  .use('/orders', orderRoutes)
  .use('/colors', colorRoutes)
  .use('/users', usersRoutes)
  .use('/address', addressRoutes);

module.exports = router;
