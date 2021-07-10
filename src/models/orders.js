const conn = require('../configs/db')

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

module.exports = {
  getProduct,
  createOrders,
  createOrderDetails,
  checkOrder,
  checkOrderDetails,
  updateOrderDetails,
  updateOrder
}