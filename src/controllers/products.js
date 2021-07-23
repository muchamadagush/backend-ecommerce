/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
const productModel = require('../models/products');
const productImageModels = require('../models/productImages');
const { v4: uuid } = require('uuid');
const path = require('path');

// Handle upload image
const uploadImageHandler = async (req) => {
  if (req.files === null) {
    throw new Error('Image product cannot be null')
  }
  const files = req.files.image
  
  const productImages = []
  await files.map((file) => {
    const extension = file.name.split('.').slice(-1)
    const fileName = `${uuid()}.${extension}`
    const outputPath = path.join(__dirname, `/../assets/images/products/${fileName}`)

    productImages.push(fileName)
    
    file.mv(outputPath)
  })

  return {
    message: 'Successfully uploaded',
    file_name: productImages,
  }
}

// Create data to products table
const createProduct = async (req, res, next) => {
  try {
    const {
      title, description, categoryId, price, stock, type, color,
    } = req.body;

    if (!title) {
      throw new Error('Title cannot be null')
    }
    if (!description) {
      throw new Error('Description cannot be null')
    }
    if (!categoryId) {
      throw new Error('Category id cannot be null')
    }
    if (!price) {
      throw new Error('Price cannot be null')
    }
    if (!stock) {
      throw new Error('Stock cannot be null')
    }
    if (!type) {
      throw new Error('Type cannot be null')
    }
    if (!color) {
      throw new Error('Color cannot be null')
    }

    const image = await uploadImageHandler(req)

    const data = {
      title,
      description,
      category_id: categoryId,
      price,
      stock,
      type,
      color,
      image: JSON.stringify(image.file_name)
    }

    await productModel.createProduct(data)

    res.status(201)
    .send({
      message: 'created new category',
      data,
    });
    
  } catch (error) {
    next(new Error(error.message));
  }
};

// Get all data from products table
const getProducts = (req, res, next) => {
  const { perPage } = req.query;
  const page = req.query.page || 1;

  const order = req.query.orderBy || 'title';
  const sort = req.query.sortBy || 'ASC';
  const search = req.query.search || '';

  const limit = perPage || 15;
  const offset = (page - 1) * limit;

  productModel
    .getAllProduct(search)
    .then((result) => {
      const allData = result.length;
      const totalPage = Math.ceil(allData / limit);
      productModel
        .getProducts(limit, offset, order, sort, search)
        .then((result) => {
          if (result.length) {
            const products = result;
            res.status(200);
            res.json({
              allData,
              page,
              perPage: limit,
              totalPage,
              data: products,
            });
          } else {
            res.status(404);
            res.json({
              message: 'Page not found',
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
    color,
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

// Get product where category
const getProductWhereCategory = (req, res, next) => {
  const categoryId = Number(req.params.category_id)
  console.log(categoryId, typeof categoryId)
  productModel
    .getProductWhereCategory(categoryId)
    .then((result) => {
      if (result.length) {
        const products = result;
        res.status(200);
        res.json({
          data: products,
        });
      } else {
        res.status(404);
        res.json({
          message: 'Page not found',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  updateProductImages,
  getProductWhereCategory
};
