/* eslint-disable no-console */
const categoryModel = require('../models/category');
const { v4: uuid } = require('uuid');

const uploadImageHandler = async (req) => {
  if(req.files === null) {
    throw new Error('No file uploaded.' );
  }

  const { image: file } = req.files;
  const outputPath = path.join(__dirname, `/uploads/${uuid()}`);
  console.log(outputPath);
  await file.mv(outputPath);

  return { 
    message: 'Successfully uploaded', 
    file_name: file.name, 
    file_path: `uploads/${file.name}`,
  };
};

const createCategory = async (req, res, next) => {
  try {
    const imageName = await uploadImageHandler(req);

    const data = {
      title: req.body.title,
      image: imageName,
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

// Create data to categories table
// const createCategory = (req, res, next) => {
//   const data = {
//     title: req.body.title,
//     image: req.body.image,
//     status: 'on',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   categoryModel
//     .createCategory(data)
//     .then(() => {
//       res.status(201);
//       res.json({
//         message: 'created new category',
//         data,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       next(new Error('Internal server error'));
//     });
// };

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
  const limit = perPage || 10;
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
};
