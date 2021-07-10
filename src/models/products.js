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
const getAllProduct = () => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM products", (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// Make pagination, search, sort data, and join with categories table
const getProducts = (limit, offset, order, sort, q) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT products.id as id, products.title as title, products.description as description, products.price as price, products.stock as stock, products.type as type, products.status as status, products.color as color, categories.title as category FROM products INNER JOIN categories ON products.category_id = categories.id  WHERE products.title LIKE '%${q}%' ORDER BY ${order} ${sort} LIMIT ${limit} OFFSET ${offset}`,
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
  getAllProduct
};
