const conn = require('../configs/db');

const addStore = (data) => new Promise((resolve, reject) => {
  conn.query('INSERT INTO store SET ?', data, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const getStoreByUserId = (userId) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM store WHERE userId = '${userId}'`, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const updateStore = (id, description) => new Promise((resolve, reject) => {
  conn.query('UPDATE store SET description = ? WHERE userId = ?',
    [description, id], (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
});

module.exports = {
  addStore,
  getStoreByUserId,
  updateStore,
};
