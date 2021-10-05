const express = require('express');
const orderControllers = require('../controllers/orders');
const auth = require('../middleware/auth');

const router = express.Router();

router
  .post('/', orderControllers.createOrders)
  .patch('/:id', orderControllers.updateOrderStatus)
  .delete('/:data', auth, orderControllers.deleteOrderDetail)
  .get('/', orderControllers.getOrders)
  .get('/user/:userId', orderControllers.getOrderByIdUser)
  .get('/cart/:userId', orderControllers.getOrderOnCart)
  .patch('/update/:id', orderControllers.updateOrderQty)
  .get('/all/:userId', orderControllers.getOrdersByUser)
  .patch('/', auth, orderControllers.checkoutOrder)
  .get('/seller', auth, orderControllers.getOrdersBySeller)
  .get('/order/:id', auth, orderControllers.getOrderById)
  .post('/payment/:id', auth, orderControllers.payment)
  .get('/payment/:orderId', auth, orderControllers.getPayment);

module.exports = router;
