const express = require('express');
const orderControllers = require('../controllers/orders')
const router = express.Router();

router
  .post('/:productId', orderControllers.createOrders)
  .patch('/:id', orderControllers.updateOrderStatus)
  .delete('/:id', orderControllers.deleteOrderDetail)

module.exports = router