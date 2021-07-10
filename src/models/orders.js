const conn = require('../configs/db')

// Get product where id
const getProduct = (productId) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM products WHERE id = ?", productId, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// Check order available
const checkOrder = (userId) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM orders WHERE userId = ${userId} AND status = 'ordered'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// Check order details available 
const checkOrderDetails = (idOrder, productId, size, color) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM orderdetails WHERE productId = ? AND orderId = ? AND color = ? AND size = ?`, [productId, idOrder, color, size], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// Make a new order
const createOrders = (data) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO orders SET ?", data, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// Make a new order details
const createOrderDetails = (orderDetail) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO orderdetails set ?", orderDetail, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// Update the subTotal of the order
const updateOrder = (subTotalUpdate, idOrder) => {
  return new Promise((resolve, reject) => {
    conn.query("UPDATE orders SET subTotal = ? WHERE id = ?", [subTotalUpdate, idOrder], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// update the quantiti of the order where orderId
const updateOrderDetails = (qtyUpdate, idOrderDetails) => {
  return new Promise((resolve, reject) => {
    conn.query("UPDATE orderdetails SET qty = ? WHERE id = ?", [qtyUpdate, idOrderDetails], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// Update the status of the order
const updateOrderStatus = (status, orderId) => {
  return new Promise((resolve, reject) => {
    conn.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = {
  getProduct,
  createOrders,
  createOrderDetails,
  checkOrder,
  checkOrderDetails,
  updateOrderDetails,
  updateOrder,
  updateOrderStatus,
}