/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');
const router = require('./src/routes')

// parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.use('/v1', router);

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
