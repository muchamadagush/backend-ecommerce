const productImagesModel = require("../models/productImages");

// Create data to productsimages table
const createProductImages = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const image = req.files.image;
  const imageName = image.name;

  const data = {
    product_id: req.body.product_id,
    image: imageName,
  };

  productImagesModel
    .createProductImages(data)
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

module.exports = {
  createProductImages,
};
