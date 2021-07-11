const conn = require("../configs/db");

// Create data to productImages table
const createProductImages = (data) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO productimages SET ?", data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

// Get data productImages table
const getProductImages = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM productimages WHERE productId = ?`, id, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  })
}

// Delete data productImages where productId
const deleteProductImage = (id) => {
  return new Promise((resolve, reject) => {
    conn.query("DELETE FROM productimages WHERE id = ?", id, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = {
  createProductImages,
  getProductImages,
  deleteProductImage
}