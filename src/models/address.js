const conn = require('../configs/db');

const findAddressByUserId = (userId) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM address WHERE userId = '${userId}' AND status = 'true'`, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Create data to address table
const createAddress = (data) => new Promise((resolve, reject) => {
  conn.query('INSERT INTO address SET ?', data, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const updateAddress = (id, data) => new Promise((resolve, reject) => {
  conn.query('UPDATE address SET ? WHERE id = ?', [data, id], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const getPrimaryAddress = (userId) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM address WHERE userId = '${userId}' AND status = 'true'`, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const getAllAddress = (userId) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM address WHERE userId = '${userId}' ORDER BY status ASC`, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const getAddress = (id) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM address WHERE id = '${id}'`, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

module.exports = {
  findAddressByUserId,
  createAddress,
  updateAddress,
  getPrimaryAddress,
  getAllAddress,
  getAddress,
};
