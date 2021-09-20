const conn = require('../configs/db');

const register = (data) => new Promise((resolve, reject) => {
  conn.query('INSERT INTO users SET ?', data, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const findUser = (email) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM users WHERE email = ?', email, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const updateUser = (id, data) => new Promise((resolve, reject) => {
  conn.query('UPDATE users SET ? WHERE id = ?',
    [data, id], (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
});

module.exports = {
  register,
  findUser,
  updateUser,
};
