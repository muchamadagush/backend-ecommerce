const express = require('express');

const router = express.Router();
const addressControllers = require('../controllers/address');
const auth = require('../middleware/auth');

router
  .post('/', auth, addressControllers.createAddress)
  .get('/', auth, addressControllers.getPrimaryAddress);

module.exports = router;
