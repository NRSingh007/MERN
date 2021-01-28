const express = require("express");
const router = express.Router();
// var { check, body, validationResult } = require("express-validator");

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// all params
router.param("productId", getProductById);
router.param("userId", getUserById);

// actual Routes
// create routes
router.post(
  "/product/create/:userId",
  // [
  //   check("name", "Name cannot be empty").isEmpty(),
  //   check("description", "Description cannot be less than 20 words").isLength({
  //     min: 20,
  //   }),
  //   check("price", "Price cannot be empty").isEmpty(),
  //   check("category", "Category cannot be empty").isEmpty(),
  //   check("stock", "Stock cannot be empty").isEmpty(),
  // ],
  isSignedIn,
  isAuthenticated,
  createProduct
);

// read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// delete routes
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// update product
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// listing routes
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
