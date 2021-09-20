/* eslint-disable no-sequences */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs/promises');
const categoryModel = require('../models/category');
const redis = require('../models/redis');

const uploadImageHandler = async (req) => {
  if (req.files === null) {
    throw new Error('No file uploaded.');
  }
  if (req.files.image.size > 2 * 1024 * 1024) {
    throw new Error('File size too large!');
  }

  const allowedExtension = ['.png', '.jpg', '.jpeg'];
  const { image: file } = req.files;
  const extension = path.extname(file.name);

  if (!allowedExtension.includes(extension)) {
    throw new Error(`File type ${extension} are not supported!`);
  }

  const fileName = `${uuid()}${extension}`;
  const outputPath = path.join(__dirname, `/../assets/images/${fileName}`);
  await file.mv(outputPath);

  return {
    message: 'Successfully uploaded',
    file_name: fileName,
    file_path: `${fileName}`,
  };
};

const createCategory = async (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      return res
        .status(400)
        .send({ message: 'you do not have access rights to add category data' });
    }

    if (!req.body.title) {
      throw new Error('Title cannot be null');
    }

    const imageName = await uploadImageHandler(req);

    const data = {
      title: req.body.title,
      image: imageName.file_name,
      status: 'on',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await categoryModel.createCategory(data);

    res.status(201).send({
      message: 'created new category',
      data,
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

// Get data from categories table
const getCategory = async (req, res, next) => {
  try {
    const {
      perPage, page, orderBy, sortBy,
    } = req.query;

    const pages = page || 1;
    const order = orderBy || 'id';
    const sort = sortBy || 'ASC';
    const limit = perPage || 15;
    const offset = (pages - 1) * limit;

    const { replay } = await redis.get('allCategory');

    if (replay !== null) {
      res.status(200);
      res.json({
        message: 'data from cache',
        data: JSON.parse(replay),
      });
    } else {
      const result = await categoryModel.getCategory(limit, offset, order, sort);

      redis.set('allCategory', JSON.stringify(result));

      res.status(200);
      res.json({
        data: result,
      });
    }
  } catch (error) {
    next(new Error('Internal server error'));
  }
};

// Get Category By id
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('jalan');

    const { replay } = await redis.get(`v1/category/${id}`);

    if (replay !== null) {
      res.status(200);
      res.json({
        message: 'data from cache',
        data: JSON.parse(replay),
      });
    } else {
      const result = await categoryModel.getCategoryById(id);

      redis.set(`v1/category/${id}`, JSON.stringify(result));

      res.status(200);
      res.json({
        data: result,
      });
    }
  } catch (error) {
    next(new Error('Internal server error'));
  }
};

// Update data from categories table
const updateCategory = async (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      return res
        .status(400)
        .send({ message: 'you do not have access rights to edit category data' });
    }

    if (!req.body.title) {
      throw new Error('Title cannot be null');
    }
    if (!req.body.status) {
      throw new Error('Status cannot be null');
    }

    const imageName = await uploadImageHandler(req);

    const { id } = req.params;
    const { title, status } = req.body;
    const data = {
      title,
      image: imageName.file_name,
      status,
      updatedAt: new Date(),
    };

    const category = await categoryModel.getCategoryById(id);
    const oldImage = category[0].image;

    await categoryModel.updateCategory(data, id);

    // eslint-disable-next-line no-unused-expressions
    fs.unlink(path.join(__dirname, `/../assets/images/${oldImage}`)),
    (err) => {
      if (err) {
        console.log(`Error unlink image product!${err}`);
      }
    };

    res.status(200).send({
      message: 'successfully update category!',
      data,
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

// Delete data from categories table
const deleteCategory = async (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      return res
        .status(400)
        .send({ message: 'you do not have access rights to delete category data' });
    }

    const { id } = req.params;

    const category = await categoryModel.getCategoryById(id);
    const oldImage = category[0].image;

    await categoryModel.deleteCategory(id);

    // eslint-disable-next-line no-unused-expressions
    fs.unlink(path.join(__dirname, `/../assets/images/${oldImage}`)),
    (err) => {
      if (err) {
        console.log(`Error unlink image product!${err}`);
      }
    };

    res.status(202);
    res.json({
      message: 'data successfully deleted',
    });
  } catch (error) {
    next(new Error(`Internal server error ${error}`));
  }
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
