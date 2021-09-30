const express = require('express');

const router = express.Router();
const addressControllers = require('../controllers/address');
const auth = require('../middleware/auth');

router
  .post('/', auth, addressControllers.createAddress)
  .get('/', auth, addressControllers.getPrimaryAddress)
  .get('/all', auth, addressControllers.getAllAddress)
  .get('/edit/:id', auth, addressControllers.getAddress)
  .patch('/edit/:id', auth, addressControllers.updateAddress);

module.exports = router;
