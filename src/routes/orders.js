const express = require('express');
const orderControllers = require('../controllers/orders')
const router = express.Router();

router.post('/:productId', orderControllers.createOrders)
router.patch('/:id', orderControllers.updateOrderStatus)

module.exports = router