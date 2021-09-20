const express = require('express');
const orderControllers = require('../controllers/orders');

const router = express.Router();

router
  .post('/', orderControllers.createOrders)
  .patch('/:id', orderControllers.updateOrderStatus)
  .delete('/:id', orderControllers.deleteOrderDetail)
  .get('/', orderControllers.getOrders)
  .get('/user/:userId', orderControllers.getOrderByIdUser)
  .get('/cart/:userId', orderControllers.getOrderOnCart)
  .patch('/update/:id', orderControllers.updateOrderQty)
  .get('/all/:userId', orderControllers.getOrdersByUser);

module.exports = router;
