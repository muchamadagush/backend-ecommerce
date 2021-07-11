const express = require('express');

const router = express.Router();
const colorController = require('../controllers/colors');

router
  .post('/', colorController.createColor)
  .get('/', colorController.getColors)
  .put('/:id', colorController.updateColor)
  .delete('/:id', colorController.deleteColor);

module.exports = router;
