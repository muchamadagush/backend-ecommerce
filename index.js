require("dotenv").config();
const express = require("express");
const formData = require("express-form-data");
const app = express();

// routes
const productRoutes = require("./src/routes/products");
const categoryRoutes = require("./src/routes/category");
const productImageRoutes = require("./src/routes/productImages");

// parse json
app.use(express.json());
app.use(formData.parse());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRoutes);
app.use("/category", categoryRoutes);
app.use("/productimages", productImageRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});