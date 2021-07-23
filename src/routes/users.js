const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users');


router
  .post('/register', userControllers.register)
// .post('/login', userControllers.login)

module.exports = router