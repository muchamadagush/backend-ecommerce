const productModel = require("../models/products");
const productImageModels = require("../models/productImages");

// Create data to products table
const createProduct = (req, res) => {
  const { title, description, categoryId, price, stock, type, color, mainImage, image } =
    req.body;
  const data = {
    title: title,
    description: description,
    category_id: categoryId,
    price: price,
    stock: stock,
    type: type,
    color: JSON.stringify(color),
    status: "on",
    mainImage: mainImage,
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
        message: "data successfully created",
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        message: error,
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

// Get product by id
const getProduct = (req, res) => {
  const id = req.params.id;

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
            data: data,
          });
        })
        .catch((error) => {
          res.status(404);
          res.json({
            message: "Data product not found",
          });
        });
    })
    .catch((error) => {
      res.status(404);
      res.json({
        message: "Data product not found",
      });
    });
};

// Update data from products table
const updateProduct = (req, res) => {
  const { title, description, categoryId, price, stock, type, status, color, mainImage } =
    req.body;
  const id = req.params.id;
  const data = {
    title: title,
    description: description,
    category_id: categoryId,
    price: price,
    stock: stock,
    type: type,
    status: status,
    color: JSON.stringify(color),
    mainImage: mainImage,
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
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

// Delete data from products table
const deleteProduct = (req, res) => {
  const id = req.params.id;
  productModel
    .deleteProduct(id)
    .then((result) => {
      if (result.affectedRows != 0) {
        productImageModels
          .deleteProductImage(id)
          .then((result) => {
            res.status(200);
            res.json({
              message: "Product successfully deleted",
            });
          })
          .catch((error) => {
            res.status(500);
            res.json({
              message: "Internal server error",
              error: error,
            });
          });
      } else {
        res.status(404);
        res.json({
          message: "Product not found",
        });
      }
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

// Update product images where idProduct
const updateProductImages = (req, res) => {
  const productId = req.params.id;
  const image = req.body.image

  productImageModels
    .deleteProductImage(productId)
    .then(() => {
      for (let i = 0; i < image.length; i++) {
        const data = {
          productId: productId,
          image: image[i],
        };
        productImageModels.createProductImages(data)
          .catch((error) => {
            res.json({
              message: "Internal server error on update image", 
              error: error,
            });
          });
      }
      res.status(201);
      data.image = image;
      res.json({
        message: "successfully update images product",
        data: data,
      });
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
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  updateProductImages
};
