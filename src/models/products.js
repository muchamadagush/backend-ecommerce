const conn = require("../configs/db");

// Create data to products table
const createProduct = (data) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO products SET ?", data, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
};

// Get all data from products table
const getProducts = (limit, offset, order, sort) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM products ORDER BY ${order} ${sort} LIMIT ${limit} OFFSET ${offset}`,
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

// Update data from products table
const updateProduct = (data, id) => {
  return new Promise((resolve, reject) => {
    conn.query("UPDATE products SET ? WHERE id = ?", [data, id], (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
};

// Delete data from products table
const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    conn.query("DELETE FROM products WHERE id = ?", id, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
