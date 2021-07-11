/* eslint-disable no-console */
/* eslint-disable eqeqeq */
const colorModels = require('../models/colors');

// Create data to colors table
const createColor = (req, res, next) => {
  const { title } = req.body;

  const data = {
    title,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  colorModels
    .createColor(data)
    .then((result) => {
      res.status(201);
      res.json({
        message: `color ${title} successfully added`,
        data: result,
      });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

const getColors = (req, res, next) => {
  colorModels
    .getColors()
    .then((result) => {
      res.status(200);
      res.json({
        message: 'successfully get data',
        data: result,
      });
    })
    .then((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Update color
const updateColor = (req, res, next) => {
  const { id } = req.params;
  const data = {
    title: req.body.title,
    updatedAt: new Date(),
  };

  colorModels
    .updateColor(data, id)
    .then((result) => {
      if (result.affectedRows != 0) {
        res.status(200);
        res.json({
          message: 'Color successfully updated',
        });
      } else {
        res.status(404);
        res.json({
          message: 'Color not found',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

// Delete color
const deleteColor = (req, res, next) => {
  const { id } = req.params;

  colorModels
    .deleteColor(id)
    .then((result) => {
      console.log(result);
      if (result.affectedRows != 0) {
        res.status(200);
        res.json({
          message: 'Color successfully deleted',
        });
      } else {
        res.status(404);
        res.json({
          message: 'Color not found',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      next(new Error('Internal server error'));
    });
};

module.exports = {
  createColor,
  getColors,
  updateColor,
  deleteColor,
};
