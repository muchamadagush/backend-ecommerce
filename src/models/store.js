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

module.exports = {
  addStore,
};
