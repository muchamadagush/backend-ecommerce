const colorModels = require("../models/colors");

// Create data to colors table
const createColor = (req, res) => {
  const title = req.body.title;

  const data = {
    title: title,
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
      res.json({
        message: error,
      });
    });
};

const getColors = (req, res) => {
  colorModels
    .getColors()
    .then((result) => {
      res.status(200);
      res.json({
        message: "successfully get data",
        data: result,
      });
    })
    .then((error) => {
      res.json({
        mesage: error,
      });
    });
};

// Update color
const updateColor = (req, res) => {
  const id = req.params.id;
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
          message: "Color successfully updated",
        });
      } else {
        res.status(404);
        res.json({
          message: "Color not found",
        });
      }
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

// Delete color
const deleteColor = (req, res) => {
  const id = req.params.id;

  colorModels
    .deleteColor(id)
    .then((result) => {
      console.log(result);
      if (result.affectedRows != 0) {
        res.status(200);
        res.json({
          message: "Color successfully deleted",
        });
      } else {
        res.status(404);
        res.json({
          message: "Color not found",
        });
      }
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

module.exports = {
  createColor,
  getColors,
  updateColor,
  deleteColor,
};
