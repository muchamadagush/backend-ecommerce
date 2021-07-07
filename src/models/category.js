const conn = require("../configs/db");

// Create data to categories table
const createCategory = (data) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO categories SET ?", data, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
};

// Get data from categories table
const getCategory = (limit, offset, order, sort) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM categories ORDER BY ${order} ${sort} LIMIT ${limit} OFFSET ${offset}`,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      }
    );
  });
};

// Update data from categories table
const updateCategory = (data, id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE categories SET ? WHERE id = ?`,
      [data, id],
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      }
    );
  });
};

// Delete data from categories table
const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(`DELETE FROM categories WHERE id = ?`, id, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
