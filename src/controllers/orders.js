const orderModels = require("../models/orders");
const { v4: uuid } = require("uuid");
const conn = require("../configs/db");

// Create Order
const createOrders = (req, res) => {
  const id = uuid().split("-").join("");
  const productId = req.params.productId;
  const { size, color, qty, userId } = req.body;

  const dataOrder = {
    orderId: id,
    productId: productId,
    size: size,
    color: color,
    qty: qty,
  };

  orderModels
    .getProduct(productId)
    .then((result) => {
      const subTotal = result[0].price * qty;
      orderModels
        .checkOrder(userId)
        .then((result) => {
          if (result.length == 0) {
            const data = {
              id: id,
              userId: userId,
              subTotal: subTotal,
              status: "oncart",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            orderModels
              .createOrders(data)
              .then((result) => {
                orderModels
                  .createOrderDetails(dataOrder)
                  .then((result) => {
                    res.status(201);
                    result.info = "Successfully create order";
                    res.json({
                      message: result,
                    });
                  })
                  .catch((error) => {
                    res.json({
                      message: "error create order details",
                      error: error,
                    });
                  });
              })
              .catch((error) => {
                res.json({
                  message: "error create order",
                  error: error,
                });
              });
          } else {
            let idOrder = result[0].id;
            let subTotalUpdate = result[0].subTotal + subTotal;
            const orderDetail = {
              orderId: idOrder,
              productId: productId,
              size: size,
              color: color,
              qty: qty,
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
                            message: "Data succesfully created",
                            data: result,
                          });
                        })
                        .catch((error) => {
                          res.json({
                            message: "error create order details",
                            error: error,
                          });
                        });
                    } else {
                      const idOrderDetails = result[0].id;
                      let qtyUpdate = result[0].qty + parseInt(qty);
                      orderModels
                        .updateOrderDetails(qtyUpdate, idOrderDetails)
                        .then((result) => {
                          res.status(200);
                          res.json({
                            message: "Data succesfully updated",
                            data: result,
                          });
                        })
                        .catch((error) => {
                          res.json({
                            message: "error update order details",
                            error: error,
                          });
                        });
                    }
                  })
                  .catch((error) => {
                    res.json({
                      message: "error check order details",
                      error: error,
                    });
                  });
              })
              .catch((error) => {
                res.json({
                  message: error,
                });
              });
          }
        })
        .catch((error) => {
          res.json({
            message: error,
          });
        });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

// Update order status
const updateOrderStatus = (req, res) => {
  const status = req.body.status;
  const orderId = req.params.id;

  orderModels
    .updateOrderStatus(status, orderId)
    .then((result) => {
      res.status(200);
      res.json({
        message: "Order successfully update",
      });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

const deleteOrderDetail = (req, res) => {
  const id = req.params.id;

  orderModels
    .getOrderDetail(id)
    .then((result) => {
      if (result.length == 1) {
        const orderId = result[0].orderId;
        const productId = result[0].productId;
        const orderQty = result[0].qty;

        orderModels
          .getProduct(productId)
          .then((result) => {
            const price = result[0].price;
            const minusSubTotal = orderQty * price;
            orderModels
              .getOrderDetails(orderId)
              .then((result) => {
                const orderId = result[0].orderId;
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
                                  "Product successfully deleted from cart",
                                data: result,
                              });
                            })
                            .catch((error) => {
                              res.status(500);
                              res.json({
                                message: "Internal server error on update sub total order",
                                error: error,
                              });
                            });
                        })
                        .catch((error) => {
                          res.status(500);
                          res.json({
                            message: "Internal server error on delete order details",
                            error: error,
                          });
                        });
                    })
                    .catch(() => {
                      res.status(500);
                      res.json({
                        message: "Internal server error on get order where id",
                        error: error,
                      });
                    });
                } else {
                  orderModels
                    .deleteOrder(orderId)
                    .then((result) => {
                      orderModels
                        .deleteOrderDetail(id)
                        .then((result) => {
                          res.status(200);
                          res.json({
                            message: "Product successfully deleted from cart",
                            data: result,
                          });
                        })
                        .catch((error) => {
                          res.status(500);
                          res.json({
                            message: "Internal server error",
                            error: error,
                          });
                        });
                    })
                    .catch((error) => {
                      res.status(500);
                      res.json({
                        message: "Internal server error",
                        error: error,
                      });
                    });
                }
              })
              .catch((error) => {
                res.status(500);
                res.json({
                  message: "Internal server error",
                  error: error,
                });
              });
          })
          .catch((error) => {
            res.status(500);
            res.json({
              message: "Internal server error on get product",
              error: error,
            });
          });
      } else {
        res.status(404);
        res.json({
          message: "Data product not found",
        });
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({
        message: "Internal server error",
        error: error,
      });
    });
};

module.exports = {
  createOrders,
  updateOrderStatus,
  deleteOrderDetail,
};
