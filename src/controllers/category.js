/* eslint-disable no-console */
const categoryModel = require('../models/category');

// Create data to categories table
const createCategory = (req, res, next) => {
  const data = {
    title: req.body.title,
    status: 'on',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  categoryModel
    .createCategory(data)
    .then(() => {
      res.status(201);
      res.json({
        message: 'created new category',
        data,
      });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Get data from categories table
const getCategory = (req, res, next) => {
  const {
    perPage,
    page,
    orderBy,
    sortBy,
  } = req.query;

  const pages = page || 1;
  const order = orderBy || 'id';
  const sort = sortBy || 'ASC';
  const limit = perPage || 5;
  const offset = (pages - 1) * limit;

  categoryModel
    .getCategory(limit, offset, order, sort)
    .then((result) => {
      const categories = result;
      res.status(200);
      res.json({
        data: categories,
      });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Update data from categories table
const updateCategory = (req, res, next) => {
  const {
    id,
  } = req.params;

  const { title, status } = req.body;
  const data = {
    title,
    status,
    updatedAt: new Date(),
  };

  categoryModel
    .updateCategory(data, id)
    .then((result) => {
      if (result.affectedRows) {
        res.status(200);
        res.json({
          message: 'data successfully updated',
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

// Delete data from categories table
const deleteCategory = (req, res, next) => {
  const {
    id,
  } = req.params;

  categoryModel
    .deleteCategory(id)
    .then((result) => {
      if (result.affectedRows) {
        res.status(200);
        res.json({
          message: 'data successfully deleted',
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
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
