/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).send({ message: 'Need token' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') return res.status(403).send({ message: 'Token expired' });
      if (err.name === 'JsonWebTokenError') return res.status(403).send({ message: err.message });
      if (err.name === 'NotBeforeError') return res.status(403).send({ message: 'Token not active' });
    }

    req.user = decoded;

    next();
  });
};

module.exports = authenticateToken;
