const categoryModel = require("../models/category");

// Create data to categories table
const createCategory = (req, res) => {
  const { title } = req.body;
  const data = {
    title: title,
    status: "on",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  categoryModel
    .createCategory(data)
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

// Get data from categories table
const getCategory = (req, res) => {
  const perPage = req.query.perPage;
  const page = req.query.page || 1;

  const order = req.query.orderBy || "id";
  const sort = req.query.sortBy || "ASC";

  const limit = perPage || 5;
  const offset = (page - 1) * limit;

  categoryModel
    .getCategory(limit, offset, order, sort)
    .then((result) => {
      const categories = result;
      res.status(200);
      res.json({
        data: categories,
      });
    })
    .catch((err) => {
      res.json({
        message: err,
      });
    });
};

// Update data from categories table
const updateCategory = (req, res) => {
  const id = req.params.id;
  const { title, status } = req.body;
  const data = {
    title: title,
    status: status,
    updatedAt: new Date(),
  };

  categoryModel
    .updateCategory(data, id)
    .then(() => {
      res.status(200);
      res.json({
        message: "data successfully updated",
      });
    })
    .catch((err) => {
      res.json({
        message: err,
      });
    });
};

// Delete data from categories table
const deleteCategory = (req, res) => {
  const id = req.params.id;

  categoryModel
    .deleteCategory(id)
    .then(() => {
      res.status(200),
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
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
