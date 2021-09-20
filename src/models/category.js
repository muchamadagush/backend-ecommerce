const conn = require('../configs/db');

// Create data to categories table
const createCategory = (data) => new Promise((resolve, reject) => {
  conn.query('INSERT INTO categories SET ?', data, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get data from categories table
const getCategory = (limit, offset, order, sort) => new Promise((resolve, reject) => {
  conn.query(
    `SELECT * FROM categories ORDER BY ${order} ${sort} LIMIT ${limit} OFFSET ${offset}`,
    (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );
});

// Get data from categories table
const getCategoryById = (id) => new Promise((resolve, reject) => {
  conn.query(
    `SELECT * FROM categories WHERE id = ${id}`,
    (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );
});

// Update data from categories table
const updateCategory = (data, id) => new Promise((resolve, reject) => {
  conn.query(
    'UPDATE categories SET ? WHERE id = ?',
    [data, id],
    (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );
});

// Delete data from categories table
const deleteCategory = (id) => new Promise((resolve, reject) => {
  conn.query('DELETE FROM categories WHERE id = ?', id, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
