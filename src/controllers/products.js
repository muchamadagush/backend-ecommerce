/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
const productModel = require('../models/products');
const productImageModels = require('../models/productImages');

// Create data to products table
const createProduct = (req, res, next) => {
  const {
    title, description, categoryId, price, stock, type, color, mainImage, image,
  } = req.body;
  const data = {
    title,
    description,
    category_id: categoryId,
    price,
    stock,
    type,
    color: JSON.stringify(color),
    status: 'on',
    mainImage,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  productModel
    .createProduct(data)
    .then((result) => {
      if (image.length != 0) {
        for (let i = 0; i < image.length; i++) {
          const data = {
            productId: result.insertId,
            image: image[i],
          };
          productImageModels.createProductImages(data).catch((error) => {
            res.json({
              message: error,
            });
          });
        }
      }
      res.status(201);
      data.image = image;
      res.json({
        message: 'data successfully created',
        data,
      });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Get all data from products table
const getProducts = (req, res, next) => {
  const { perPage } = req.query;
  const page = req.query.page || 1;

  const order = req.query.orderBy || 'title';
  const sort = req.query.sortBy || 'ASC';
  const q = req.query.q || '';

  const limit = perPage || 5;
  const offset = (page - 1) * limit;

  productModel
    .getAllProduct()
    .then((result) => {
      const allData = result.length;
      const totalPage = Math.ceil(allData / limit);
      productModel
        .getProducts(limit, offset, order, sort, q)
        .then((result) => {
          const products = result;
          res.status(200);
          res.json({
            allData,
            page,
            perPage: limit,
            totalPage,
            data: products,
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
};

// Get product by id
const getProduct = (req, res, next) => {
  const { id } = req.params;

  productModel
    .getProduct(id)
    .then((result) => {
      const data = result;
      productImageModels
        .getProductImages(id)
        .then((result) => {
          data[0].image = result;
          res.status(200);
          res.json({
            data,
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
};

// Update data from products table
const updateProduct = (req, res, next) => {
  const {
    title, description, categoryId, price, stock, type, status, color, mainImage,
  } = req.body;
  const { id } = req.params;
  const data = {
    title,
    description,
    category_id: categoryId,
    price,
    stock,
    type,
    status,
    color: JSON.stringify(color),
    mainImage,
    updatedAt: new Date(),
  };

  productModel
    .updateProduct(data, id)
    .then(() => {
      res.status(200);
      res.json({
        message: 'data successfully update',
      });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Delete data from products table
const deleteProduct = (req, res, next) => {
  const { id } = req.params;
  productModel
    .deleteProduct(id)
    .then((result) => {
      if (result.affectedRows != 0) {
        productImageModels
          .deleteProductImage(id)
          .then(() => {
            res.status(200);
            res.json({
              message: 'Product successfully deleted',
            });
          })
          .catch((error) => {
            console.log(error);
            next(new Error('Internal server error'));
          });
      } else {
        res.status(404);
        res.json({
          message: 'Product not found',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Update product images where idProduct
const updateProductImages = (req, res, next) => {
  const productId = req.params.id;
  const { image } = req.body;

  productImageModels
    .deleteProductImage(productId)
    .then((result) => {
      if (result.affectedRows) {
        for (let i = 0; i < image.length; i++) {
          const data = {
            productId,
            image: image[i],
          };
          productImageModels.createProductImages(data)
            .catch((error) => {
              console.log(error);
              next(new Error('Internal server error'));
            });
        }
        res.status(200);
        res.json({
          message: 'successfully update images product',
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

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  updateProductImages,
};
