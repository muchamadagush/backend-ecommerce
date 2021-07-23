/* eslint-disable no-console */
const categoryModel = require('../models/category');
const { v4: uuid } = require('uuid');
const path = require('path');


const uploadImageHandler = async (req) => {
  if (req.files === null) {
    throw new Error('No file uploaded.');
  }

  if (!req.body.title) {
    throw new Error('Title cannot be null')
  }

  const { image: file } = req.files;
  const extension = file.name.split('.').slice(-1);
  const fileName = `${uuid()}.${extension}`;
  const outputPath = path.join(__dirname, `/../assets/images/category/${fileName}`);
  await file.mv(outputPath);

  return {
    message: 'Successfully uploaded',
    file_name: fileName,
    file_path: `${fileName}`,
  };
};

const createCategory = async (req, res, next) => {
  try {
    const imageName = await uploadImageHandler(req);

    const data = {
      title: req.body.title,
      image: imageName.file_name,
      status: 'on',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await categoryModel.createCategory(data)

    res.status(201)
      .send({
        message: 'created new category',
        data,
      });
  } catch (error) {
    console.log(error);
    next(new Error('Internal server error'));
  }
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
  const limit = perPage || 15;
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

// Get Category By id
const getCategoryById = (req, res, next) => {
  const id = req.params.id
  categoryModel
    .getCategoryById(id)
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

  const { title, image, status } = req.body;
  const data = {
    title,
    image,
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
  getCategoryById
};
