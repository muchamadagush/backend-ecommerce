/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
const { v4: uuid } = require('uuid');
const orderModels = require('../models/orders');

// Create Order
const createOrders = (req, res, next) => {
  const id = uuid().split('-').join('');
  const { productId } = req.params;
  const {
    size, color, qty, userId,
  } = req.body;

  const dataOrder = {
    orderId: id,
    productId,
    size,
    color,
    qty,
  };

  orderModels
    .getProduct(productId)
    .then((result) => {
      if (result.length) {
        const subTotal = result[0].price * qty;
        orderModels
          .checkOrder(userId)
          .then((result) => {
            if (result.length == 0) {
              const data = {
                id,
                userId,
                subTotal,
                status: 'oncart',
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              orderModels
                .createOrders(data)
                .then(() => {
                  orderModels
                    .createOrderDetails(dataOrder)
                    .then((result) => {
                      res.status(201);
                      result.info = 'Successfully create order';
                      res.json({
                        message: result,
                      });
                    })
                    .catch((error) => {
                      console.log(error);
                      next(new Error('Internal server error'));
                    });
                })
                .catch((error) => {
                  console.log(error);
                  next(new Error('Internal server error'));
                });
            } else {
              const idOrder = result[0].id;
              const subTotalUpdate = result[0].subTotal + subTotal;
              const orderDetail = {
                orderId: idOrder,
                productId,
                size,
                color,
                qty,
              };

              orderModels
                .updateOrder(subTotalUpdate, idOrder)
                .then(() => {
                  orderModels
                    .checkOrderDetails(idOrder, productId, size, color)
                    .then((result) => {
                      if (result.length == 0) {
                        orderModels
                          .createOrderDetails(orderDetail)
                          .then((result) => {
                            res.status(201);
                            res.json({
                              message: 'Data succesfully created',
                              data: result,
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                            next(new Error('Internal server error'));
                          });
                      } else {
                        const idOrderDetails = result[0].id;
                        const qtyUpdate = result[0].qty + parseInt(qty);
                        orderModels
                          .updateOrderDetails(qtyUpdate, idOrderDetails)
                          .then((result) => {
                            res.status(200);
                            res.json({
                              message: 'Data succesfully updated',
                              data: result,
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                            next(new Error('Internal server error'));
                          });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      next(new Error('Internal server error'));
                    });
                })
                .catch((error) => {
                  console.log(error);
                  next(new Error('Internal server error'));
                });
            }
          })
          .catch((error) => {
            console.log(error);
            next(new Error('Internal server error'));
          });
      } else {
        res.status(404);
        res.json({
          message: 'data not found',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Update order status
const updateOrderStatus = (req, res, next) => {
  const { status } = req.body;
  const orderId = req.params.id;

  orderModels
    .updateOrderStatus(status, orderId)
    .then(() => {
      res.status(200);
      res.json({
        message: 'Order successfully update',
      });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

const deleteOrderDetail = (req, res, next) => {
  const { id } = req.params;

  orderModels
    .getOrderDetail(id)
    .then((result) => {
      if (result.length == 1) {
        const { orderId } = result[0];
        const { productId } = result[0];
        const orderQty = result[0].qty;

        orderModels
          .getProduct(productId)
          .then((result) => {
            const { price } = result[0];
            const minusSubTotal = orderQty * price;
            orderModels
              .getOrderDetails(orderId)
              .then((result) => {
                const { orderId } = result[0];
                if (result.length > 1) {
                  orderModels
                    .getOrder(orderId)
                    .then((result) => {
                      const newSubTotal = result[0].subTotal - minusSubTotal;
                      orderModels
                        .deleteOrderDetail(id)
                        .then((result) => {
                          orderModels
                            .updateOrder(newSubTotal, orderId)
                            .then(() => {
                              res.status(200);
                              res.json({
                                message:
                                  'Product successfully deleted from cart',
                                data: result,
                              });
                            })
                            .catch((error) => {
                              console.log(error);
                              next(new Error('Internal server error'));
                            });
                        })
                        .catch((error) => {
                          console.log(error);
                          next(new Error('Internal server error'));
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      next(new Error('Internal server error'));
                    });
                } else {
                  orderModels
                    .deleteOrder(orderId)
                    .then(() => {
                      orderModels
                        .deleteOrderDetail(id)
                        .then((result) => {
                          res.status(200);
                          res.json({
                            message: 'Product successfully deleted from cart',
                            data: result,
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                          next(new Error('Internal server error'));
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      next(new Error('Internal server error'));
                    });
                }
              })
              .catch((error) => {
                console.log(error);
                next(new Error('Internal server error'));
              });
          })
          .catch((error) => {
            console.log(error);
            next(new Error('Internal server error'));
          });
      } else {
        res.status(404);
        res.json({
          message: 'Data product not found',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Get all data orders
const getOrders = (req, res, next) => {
  orderModels
    .getOrders()
    .then((result) => {
      res.status(200);
      res.json({
        data: result,
      });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

const getOrderByIdUser = (req, res, next) => {
  const { userId } = req.params;

  orderModels
    .getOrderByIdUser(userId)
    .then((result) => {
      if (result.length) {
        res.status(200);
        res.json({
          data: result,
        });
      } else {
        res.status(404);
        res.json({
          message: `Order data where user id ${userId} not found`,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

module.exports = {
  createOrders,
  updateOrderStatus,
  deleteOrderDetail,
  getOrderByIdUser,
  getOrders,
};
