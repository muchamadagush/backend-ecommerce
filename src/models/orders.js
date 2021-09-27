const conn = require('../configs/db');

// Get product where id
const getProduct = (productId) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM products WHERE id = ?', productId, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Check order available
const checkOrder = (userId) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orders WHERE userId = ? AND status = "oncart"', userId, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Check order details available
const checkOrderDetails = (idOrder, productId, size, color) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orderdetails WHERE productId = ? AND orderId = ? AND color = ? AND size = ?', [productId, idOrder, color, size], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Make a new order
const createOrders = (data) => new Promise((resolve, reject) => {
  conn.query('INSERT INTO orders SET ?', data, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Make a new order details
const createOrderDetails = (orderDetail) => new Promise((resolve, reject) => {
  conn.query('INSERT INTO orderdetails set ?', orderDetail, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Update the subTotal of the order
const updateOrder = (subTotalUpdate, idOrder) => new Promise((resolve, reject) => {
  conn.query('UPDATE orders SET subTotal = ? WHERE id = ?', [subTotalUpdate, idOrder], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// update the quantiti of the order where orderId
const updateOrderDetails = (qtyUpdate, idOrderDetails) => new Promise((resolve, reject) => {
  conn.query('UPDATE orderdetails SET qty = ? WHERE id = ?', [qtyUpdate, idOrderDetails], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Update the status of the order
const updateOrderStatus = (status, orderId) => new Promise((resolve, reject) => {
  conn.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get order details where id
const getOrderDetail = (id) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orderdetails WHERE id = ?', id, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get order details where orderId
const getOrderDetails = (orderId) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orderdetails WHERE orderId = ?', orderId, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get all data orders
const getOrders = () => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orders', (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get order where orderId
const getOrder = (id) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orders WHERE id = ?', id, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get order where user id
const getOrderByIdUser = (id) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orders WHERE userId = ?', id, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Delete order detail where id
const deleteOrderDetail = (id) => new Promise((resolve, reject) => {
  conn.query('DELETE FROM orderdetails WHERE id = ?', id, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Delete order detail where id
const deleteOrder = (orderId) => new Promise((resolve, reject) => {
  conn.query('DELETE FROM orders WHERE id = ?', orderId, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get order onCart
const getOrderOnCart = (userId) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orders WHERE userId = ? AND status = \'oncart\'', userId, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

// Get orderDetails by OrderId
const getOrderDetailsByOrderId = (orderId) => new Promise((resolve, reject) => {
  conn.query('SELECT orderdetails.*, products.image as image, products.title as title, products.price as price FROM orderdetails INNER JOIN products ON orderdetails.productId = products.id WHERE orderId = ?', orderId, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const getOrdersByUser = (userId) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM orders WHERE userId = ?', userId, (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const checkoutOrder = (id, data) => new Promise((resolve, reject) => {
  conn.query('UPDATE orders SET ?  WHERE id = ?', [data, id], (error, result) => {
    if (!error) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

module.exports = {
  getProduct,
  createOrders,
  createOrderDetails,
  checkOrder,
  checkOrderDetails,
  updateOrderDetails,
  updateOrder,
  updateOrderStatus,
  getOrder,
  getOrderDetail,
  getOrderDetails,
  deleteOrderDetail,
  deleteOrder,
  getOrderByIdUser,
  getOrders,
  getOrderOnCart,
  getOrderDetailsByOrderId,
  getOrdersByUser,
  checkoutOrder,
};
