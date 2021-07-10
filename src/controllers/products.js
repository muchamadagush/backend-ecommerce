const productModel = require("../models/products");

// Create data to products table
const createProduct = (req, res) => {
  const { title, description, category_id, price, stock, type } = req.body;
  const data = {
    title: title,
    description: description,
    category_id: category_id,
    price: price,
    stock: stock,
    type: type,
    status: "on",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  productModel
    .createProduct(data)
    .then(() => {
      res.status(201);
      res.json({
        message: "data successfully created",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        message: err,
      });
    });
};

// Get all data from products table
const getProducts = (req, res) => {
  const perPage = req.query.perPage;
  const page = req.query.page || 1;

  const order = req.query.orderBy || "title";
  const sort = req.query.sortBy || "ASC";
  const q = req.query.q || '';

  const limit = perPage || 5;
  const offset = (page - 1) * limit;

  productModel
    .getProducts(limit, offset, order, sort, q)
    .then((result) => {
      const products = result;
      res.status(200);
      res.json({
        data: products,
      });
    })
    .catch((err) => {
      res.json({
        message: err,
      });
    });
};

// Update data from products table
const updateProduct = (req, res) => {
  const { title, description, category_id, price, stock, type, status } =
    req.body;
  const id = req.params.id;
  const data = {
    title: title,
    description: description,
    category_id: category_id,
    price: price,
    stock: stock,
    type: type,
    status: status,
    updatedAt: new Date(),
  };

  productModel
    .updateProduct(data, id)
    .then(() => {
      res.status(200);
      res.json({
        message: "data successfully update",
      });
    })
    .catch((err) => {
      res.json({
        message: err,
      });
    });
};

// Delete data from products table
const deleteProduct = (req, res) => {
  const id = req.params.id;
  productModel
    .deleteProduct(id)
    .then(() => {
      res.status(204);
      res.json({
        message: "data successfully deleted",
      });
    })
    .catch((err) => {
      res.json({
        message: err,
      });
    });
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
