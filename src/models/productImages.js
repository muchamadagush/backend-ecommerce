const conn = require("../configs/db");

// Create data to productImages table
const createProductImages = (data) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO productimages SET ?", data, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  createProductImages
}