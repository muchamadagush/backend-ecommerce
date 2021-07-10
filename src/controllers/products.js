const productModel = require("../models/products");
const productImageModels = require("../models/productImages");

// Create data to products table
const createProduct = (req, res) => {
  const { title, description, category_id, price, stock, type, color, image } =
    req.body;
  const data = {
    title: title,
    description: description,
    category_id: category_id,
    price: price,
    stock: stock,
    type: type,
    color: JSON.stringify(color),
    status: "on",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  productModel
    .createProduct(data)
    .then((result) => {
      for (let i = 0; i < image.length; i++) {
        const data = {
          productId: result.insertId,
          image: image[i],
        };
        productImageModels.createProductImages(data).catch((err) => {
          res.json({
            message: err,
          });
        });
      }
      console.log(result);
      res.status(201);
      data.image = image;
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
  const q = req.query.q || "";

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
            allData: allData,
            page: page,
            perPage: limit,
            totalPage: totalPage,
            data: products,
          });
        })
        .catch((err) => {
          res.json({
            message: err,
          });
        });
    })
    .catch((error) => {
      res.json({
        message: error,
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
