/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const formData = require('express-form-data');

const app = express();
const cors = require('cors');

// routes
const productRoutes = require('./src/routes/products');
const categoryRoutes = require('./src/routes/category');
const orderRoutes = require('./src/routes/orders');
const colorRoutes = require('./src/routes/colors');

// parse json
app.use(express.json());
app.use(formData.parse());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/products', productRoutes);
app.use('/category', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/colors', colorRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'url not found',
  });
});

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({
    message: err.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
