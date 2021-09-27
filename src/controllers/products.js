/* eslint-disable no-console */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable import/order */
const productModel = require('../models/products');
const { v4: uuid } = require('uuid');
const path = require('path');
const storeModels = require('../models/store');

// Handle upload image
const uploadImageHandler = async (req) => {
  if (req.files === null) {
    throw new Error('Image product cannot be null!');
  }

  const files = req.files.image;

  const productImages = [];

  if (Array.isArray(files)) {
    files.map((file) => {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size too large!');
      }

      const allowedExtension = ['.png', '.jpg', '.jpeg'];
      const extension = path.extname(file.name);
      const fileName = `${uuid()}${extension}`;
      const outputPath = path.join(__dirname, `/../assets/images/${fileName}`);

      if (!allowedExtension.includes(extension)) {
        throw new Error(`File type ${extension} are not supported!`);
      }

      productImages.push(fileName);

      file.mv(outputPath);
    });
  }

  if (Array.isArray(files) === false) {
    const allowedExtension = ['.png', '.jpg', '.jpeg'];
    const { image: file } = req.files;
    const extension = path.extname(file.name);

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size too large!');
    }

    if (!allowedExtension.includes(extension)) {
      throw new Error(`File type ${extension} are not supported!`);
    }

    const fileName = `${uuid()}${extension}`;
    const outputPath = path.join(__dirname, `/../assets/images/${fileName}`);

    productImages.push(fileName);

    await file.mv(outputPath);
  }

  return {
    message: 'Successfully uploaded',
    file_name: productImages,
  };
};

// Create data to products table
const createProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      return res
        .status(400)
        .send({ message: 'you do not have access rights to add product data' });
    }

    const {
      title, description, categoryId, price, stock, type, color,
    } = req.body;
    const userId = req.user.id;
    const storeId = (await storeModels.getStoreByUserId(userId))[0].id;

    if (!title) return res.status(400).send({ message: 'Title cannot be null' });
    if (!price) return res.status(400).send({ message: 'Price cannot be null' });
    if (!stock) return res.status(400).send({ message: 'Stock cannot be null' });
    if (!color) return res.status(400).send({ message: 'Color cannot be null' });
    if (!categoryId) return res.status(400).send({ message: 'Category id cannot be null' });
    if (!type) return res.status(400).send({ message: 'Type cannot be null' });
    if (!description) return res.status(400).send({ message: 'Description cannot be null' });

    const image = await uploadImageHandler(req);

    const data = {
      storeId,
      title,
      description,
      category_id: categoryId,
      price,
      stock,
      type,
      color,
      image: JSON.stringify(image.file_name),
    };

    await productModel.createProduct(data);

    res.status(201).send({
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
    .then((results) => {
      const allData = results.length;

      const totalPage = Math.ceil(allData / limit);
      productModel
        .getProducts(limit, offset, order, sort, search)
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
              allData,
              page,
              perPage: limit,
              totalPage,
              data: resProducts,
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
    })
    .catch((error) => {
      next(new Error(error.message));
    });
};

// Get product by id
const getProduct = (req, res, next) => {
  const { id } = req.params;

  productModel
    .getProduct(id)
    .then((result) => {
      const image = JSON.parse(result[0].image);
      const products = result;
      products[0].image = image;

      res.status(200);
      res.json({
        data: products,
      });
    })
    .catch((error) => {
      next(new Error(error.message));
    });
};

// Update data from products table
const updateProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      return res
        .status(400)
        .send({ message: 'you do not have access rights to update product data' });
    }

    const { id } = req.params;
    const {
      title,
      description,
      categoryId,
      price,
      stock,
      type,
      color,
      status,
    } = req.body;

    if (!title) return res.status(400).send({ message: 'Title cannot be null' });
    if (!description) return res.status(400).send({ message: 'Description cannot be null' });
    if (!categoryId) return res.status(400).send({ message: 'Category id cannot be null' });
    if (!price) return res.status(400).send({ message: 'Price cannot be null' });
    if (!stock) return res.status(400).send({ message: 'Stock cannot be null' });
    if (!type) return res.status(400).send({ message: 'Type cannot be null' });
    if (!color) return res.status(400).send({ message: 'Color cannot be null' });
    if (!status) return res.status(400).send({ message: 'Status cannot be null' });

    let image = '';
    if (req.files) { image = await (await uploadImageHandler(req)).file_name; }
    if (!req.files) { image = req.body.image; }

    const data = {
      title,
      description,
      category_id: categoryId,
      price,
      stock,
      type,
      color,
      status,
      image: JSON.stringify(image),
    };

    await productModel.updateProduct(data, id);

    res.status(200).send({
      message: 'Successfully update product!',
      data,
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

// Delete data from products table
const deleteProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      return res
        .status(400)
        .send({ message: 'you do not have access rights to delete product data' });
    }

    const { id } = req.params;

    await productModel.deleteProduct(id);

    res.status(202);
    res.json({
      message: 'Product successfully deleted',
    });
  } catch (error) {
    next(new Error('Internal server error'));
  }
};

// Get product where category
const getProductWhereCategory = (req, res, next) => {
  const categoryId = Number(req.params.id);
  productModel
    .getProductWhereCategory(categoryId)
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
          data: resProducts,
        });
      } else {
        res.status(404);
        res.json({
          message: 'Page not found',
        });
      }
    })
    .catch((error) => {
      next(new Error(error.message));
    });
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductWhereCategory,
};
