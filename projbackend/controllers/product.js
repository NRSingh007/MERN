const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
// const { check, body, validationResult } = require("express-validator");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "No such product exists",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(422).json({
  //     // validation error (express-validator)
  //     error: errors.array()[0].msg,
  //     // error: errors.array()[1].param,
  //   });
  // }

  let form = new formidable.IncomingForm(); // this creates the form object
  form.keepExtensions = true; // to keep the extension

  //   takes 3 parameters (err, fields, files)
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot post product",
      });
    }
    // destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "Image is too large, Try uploading less than 3Mb",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Unable to save the product in DB",
        });
      }
      res.json(product);
    });
  });
};
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: `Failed to delete ${deletedProduct}`,
      });
    }
    res.json({
      message: `${deletedProduct} has been deleted successfully`,
      deletedProduct,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm(); // this creates the form object
  form.keepExtensions = true; // to keep the extension

  //   takes 3 parameters (err, fields, files)
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot post product",
      });
    }

    // updation code
    let product = req.product;
    product = _.extend(product, fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "Image is too large, Try uploading less than 3Mb",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Unable to update the product",
        });
      }
      res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "ascending"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        res.status(400).json({
          error: "No product found",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    res.json(categories);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
  });
  next();
};
