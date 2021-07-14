const conn = require('../configs/db');

// Create data to products table
const createProduct = (data) => new Promise((resolve, reject) => {
  conn.query('INSERT INTO products SET ?', data, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get all data from products table
const getAllProduct = (search) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM products WHERE products.title LIKE '%${search}%' ORDER BY title ASC`, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Make pagination, search, sort data, and join with categories table
const getProducts = (limit, offset, order, sort, search) => new Promise((resolve, reject) => {
  conn.query(
    `SELECT products.id as id, products.title as title, products.description as description, products.price as price, products.stock as stock, products.type as type, products.status as status, products.color as color, products.mainImage as mainImage, categories.title as category FROM products INNER JOIN categories ON products.category_id = categories.id WHERE products.title LIKE '%${search}%' ORDER BY ${order} ${sort} LIMIT ${limit} OFFSET ${offset}`,
    (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );
});

// Get product by id
const getProduct = (id) => new Promise((resolve, reject) => {
  conn.query(`SELECT * FROM products WHERE id = ${id}`, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Update data from products table
const updateProduct = (data, id) => new Promise((resolve, reject) => {
  conn.query('UPDATE products SET ? WHERE id = ?', [data, id], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Delete data from products table
const deleteProduct = (id) => new Promise((resolve, reject) => {
  conn.query('DELETE FROM products WHERE id = ?', id, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
};
