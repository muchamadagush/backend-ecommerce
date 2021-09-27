const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/users');
const auth = require('../middleware/auth');

router
  .post('/register', userControllers.register)
  .post('/login', userControllers.login)
  .patch('/', auth, userControllers.updateUser)
  .get('/', auth, userControllers.getUser);

module.exports = router;
