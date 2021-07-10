const express = require('express');
const orderControllers = require('../controllers/orders')
const router = express.Router();

router.post('/:productId', orderControllers.createOrders)

module.exports = router