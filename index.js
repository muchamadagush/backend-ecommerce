/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');
app.use(fileUpload());


// routes
const productRoutes = require('./src/routes/products');
const categoryRoutes = require('./src/routes/category');
const orderRoutes = require('./src/routes/orders');
const colorRoutes = require('./src/routes/colors');
const usersRoutes = require('./src/routes/users');

// parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/files', express.static(__dirname + '/src/assets/images/category'))
app.use('/products', productRoutes);
app.use('/category', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/colors', colorRoutes);
app.use('/users', usersRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'url not found',
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message,
  });
});


app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
