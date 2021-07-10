const conn = require("../configs/db");

// Create data to colors table
const createColor = (data) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO colors SET ?", data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

// Get all colors
const getColors = () => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM colors", (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

// Update color
const updateColor = (data, id) => {
  return new Promise((resolve, reject) => {
    conn.query("UPDATE colors SET ? WHERE id = ?", [data, id], (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

// Delete color
const deleteColor = (id) => {
  return new Promise((resolve, reject) => {
    conn.query("DELETE FROM colors WHERE id = ?", id, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = {
  createColor,
  getColors,
  updateColor,
  deleteColor
};
