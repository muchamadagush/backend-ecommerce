require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// routes
const productRoutes = require("./src/routes/products");
const categoryRoutes = require("./src/routes/category");

// parse json
app.use(express.json());

app.use("/products", productRoutes);
app.use("/category", categoryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
