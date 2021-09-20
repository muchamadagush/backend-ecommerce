const express = require('express');

const router = express.Router();
const colorController = require('../controllers/colors');
const auth = require('../middleware/auth');

router
  .post('/', auth, colorController.createColor)
  .get('/', colorController.getColors)
  .put('/:id', auth, colorController.updateColor)
  .delete('/:id', auth, colorController.deleteColor);

module.exports = router;
