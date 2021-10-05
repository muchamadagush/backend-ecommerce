/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
const { v4: uuid } = require('uuid');
const path = require('path');
const orderModels = require('../models/orders');
const storeModels = require('../models/store');

const uploadImageHandler = async (req) => {
  if (req.files === null) {
    throw new Error('No file uploaded.');
  }
  if (req.files.image.size > 2 * 1024 * 1024) {
    throw new Error('File size too large!');
  }

  const allowedExtension = ['.png', '.jpg', '.jpeg'];
  const { image: file } = req.files;
  const extension = path.extname(file.name);

  if (!allowedExtension.includes(extension)) {
    throw new Error(`File type ${extension} are not supported!`);
  }

  const fileName = `${uuid()}${extension}`;
  const outputPath = path.join(__dirname, `/../assets/images/${fileName}`);
  await file.mv(outputPath);

  return {
    message: 'Successfully uploaded',
    file_name: fileName,
    file_path: `${fileName}`,
  };
};

// Create Order
const createOrders = (req, res, next) => {
  const orderId = uuid().split('-').join('');
  const {
    size, color, qty, userId, productId, storeId,
  } = req.body;

  if (!size) return res.status(400).send({ message: 'Size cannot be null' });
  if (!color) return res.status(400).send({ message: 'Color cannot be null' });
  if (!qty) return res.status(400).send({ message: 'Qty cannot be null' });

  const dataOrder = {
    id: uuid().split('-').join(''),
    orderId,
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
                id: orderId,
                userId,
                storeId,
                subTotal,
                invoice: Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000,
                status: 'oncart',
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              orderModels
                .createOrders(data)
                .then(() => {
                  orderModels
                    .createOrderDetails(dataOrder)
                    .then(() => {
                      res.status(201);
                      res.json({
                        message: 'Successfully create order',
                      });
                    })
                    .catch((error) => {
                      next(new Error(error.message));
                    });
                })
                .catch((error) => {
                  next(new Error(error.message));
                });
            } else {
              const idOrder = result[0].id;
              const subTotalUpdate = result[0].subTotal + subTotal;
              const orderDetail = {
                id: uuid().split('-').join(''),
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
                          .then(() => {
                            res.status(201);
                            res.json({
                              message: 'Data succesfully created',
                            });
                          })
                          .catch((error) => {
                            console.log(error, '7');
                            next(new Error('Internal server error'));
                          });
                      } else {
                        const idOrderDetails = result[0].id;
                        const qtyUpdate = result[0].qty + parseInt(qty);
                        orderModels
                          .updateOrderDetails(qtyUpdate, idOrderDetails)
                          .then(() => {
                            res.status(200);
                            res.json({
                              message: 'Data succesfully updated',
                            });
                          })
                          .catch((error) => {
                            console.log(error, '1');
                            next(new Error('Internal server error'));
                          });
                      }
                    })
                    .catch((error) => {
                      console.log(error, '2');
                      next(new Error('Internal server error'));
                    });
                })
                .catch((error) => {
                  console.log(error, '3');
                  next(new Error('Internal server error'));
                });
            }
          })
          .catch((error) => {
            console.log(error, '4');
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
      console.log(error.message);
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

const deleteOrderDetail = async (req, res, next) => {
  try {
    const { data } = req.params;
    const selectedOrder = data.split(',');

    for (let i = 0; i < selectedOrder.length; i++) {
      const resultGetOrderDetail = (
        await orderModels.getOrderDetail(selectedOrder[i])
      )[0];

      const { orderId, productId, qty } = resultGetOrderDetail;

      const resultGetProduct = (await orderModels.getProduct(productId))[0];
      const { price } = resultGetProduct;
      const minusSubTotal = qty * price;

      const resultGetOrderDetails = await orderModels.getOrderDetails(orderId);

      if (resultGetOrderDetails.length > 1) {
        const idOrder = resultGetOrderDetails[0].orderId;

        const resultGetOrder = (await orderModels.getOrder(idOrder))[0];
        const newSubTotal = resultGetOrder.subTotal - minusSubTotal;

        await orderModels.deleteOrderDetail(selectedOrder[i]);

        await orderModels.updateOrder(newSubTotal, idOrder);
      } else {
        await orderModels.deleteOrder(orderId);
        await orderModels.deleteOrderDetail(selectedOrder[i]);
      }
    }

    res.status(200);
    res.json({
      message: 'Successfully delete data!',
    });
  } catch (error) {
    next(new Error(error.message));
  }
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
      console.log(result);
      res.status(200);
      res.json({
        data: result,
      });
      // if (result.length) {
      // } else {
      //   res.status(404);
      //   res.json({
      //     message: `Order data where user id ${userId} not found`,
      //   });
      // }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

const getOrderOnCart = (req, res, next) => {
  const { userId } = req.params;

  orderModels
    .getOrderOnCart(userId)
    .then((result) => {
      if (result.length) {
        const data = result;
        const orderId = result[0].id;

        orderModels
          .getOrderDetailsByOrderId(orderId)
          .then((result) => {
            if (result.length) {
              const products = result;
              const resProducts = [];

              for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const parse = JSON.parse(products[i].image);
                product.image = parse;

                resProducts.push(product);
              }

              res.status(200);
              res.json({
                data: {
                  data,
                  products: resProducts,
                },
              });
            } else {
              res.status(404);
              res.json({
                message: 'Data not found',
              });
            }
          })
          .catch((error) => {
            console.log(error);
            next(new Error('Internal server error get'));
          });
      } else {
        res.status(404);
        res.json({
          message: 'Data not found',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

const updateOrderQty = (req, res, next) => {
  const { qty } = req.body;
  const { id } = req.params;

  orderModels
    .getOrderDetail(id)
    .then((result) => {
      const { productId } = result[0];
      const { orderId } = result[0];
      const total = result[0].qty;
      orderModels
        .getProduct(productId)
        .then((result) => {
          const { price } = result[0];
          const newSubTotal = price * qty;
          const minusSubTotal = total * price;
          orderModels.getOrder(orderId).then((result) => {
            const subTotal = result[0].subTotal - minusSubTotal + newSubTotal;
            orderModels
              .updateOrder(subTotal, orderId)
              .then(() => {
                orderModels
                  .updateOrderDetails(qty, id)
                  .then(() => {
                    res.status(200);
                    res.json({
                      message: 'Data succesfully updated',
                    });
                  })
                  .catch((error) => {
                    next(new Error(error.message));
                  });
              })
              .catch((error) => {
                next(new Error(error.message));
              });
          });
        })
        .catch((error) => {
          next(new Error(error.message));
        });
    })
    .catch((error) => {
      next(new Error(error.message));
    });
};

const getOrdersByUser = (req, res, next) => {
  const { userId } = req.params;

  orderModels
    .getOrdersByUser(userId)
    .then((result) => {
      if (result.length) {
        res.status(200);
        res.json({
          data: result,
        });
      } else {
        res.status(404);
        res.json({
          message: 'Data not found',
        });
      }
    })
    .catch((error) => {
      next(new Error(error.message));
    });
};

const checkoutOrder = async (req, res, next) => {
  try {
    const { id, status, addressId } = req.body;

    const data = {
      status,
      addressId,
    };

    await orderModels.checkoutOrder(id, data);

    res.status(200);
    res.json({
      message: 'Successfully checkout order!',
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

const getOrdersBySeller = async (req, res, next) => {
  try {
    const { id } = req.user;

    const storeId = (await storeModels.getStoreByUserId(id))[0].id;
    const response = await orderModels.getOrdersSeller(storeId);

    res.status(200);
    res.json({
      data: response,
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await orderModels.getOrderDetailsByOrderId(id);

    const data = [];
    for (let i = 0; i < response.length; i++) {
      const respons = response[i];
      const parse = JSON.parse(response[i].image);
      respons.image = parse;

      data.push(respons);
    }

    res.status(200);
    res.json({
      data,
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

const payment = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { name } = req.body;

    const image = await uploadImageHandler(req);

    const data = {
      id: uuid().split('-').join(''),
      orderId,
      name,
      image: JSON.stringify(image.file_name),
      createdAt: new Date(),
    };

    await orderModels.payment(data);

    await orderModels.updateOrderStatus('pending', orderId);

    res.status(200);
    res.json({
      message: 'Payment in progress',
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

module.exports = {
  createOrders,
  updateOrderStatus,
  deleteOrderDetail,
  getOrderByIdUser,
  getOrders,
  getOrderOnCart,
  updateOrderQty,
  getOrdersByUser,
  checkoutOrder,
  getOrdersBySeller,
  getOrderById,
  payment,
};
