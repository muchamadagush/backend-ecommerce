const orderModels = require("../models/orders");
const { v4: uuid } = require("uuid");

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
              status: "ordered",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            orderModels
              .createOrders(data)
              .then((result) => {
                console.log(result);
                orderModels
                  .createOrderDetails(dataOrder)
                  .then((result) => {
                    res.status(201);
                    result.info = "Successfully create order"
                    res.json({
                      message: result,
                    });
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
                            message: error,
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

module.exports = {
  createOrders,
};
