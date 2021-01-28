const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "No such category exists",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body); // creating a new category object from class
  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Unable to create category",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "Unable to get all categories",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category; // this able to populate as it is from the middleware getCategoryById
  category.name = req.body.name; // this will populate from the fills that are passed from the frontend

  category.save((err, updatedCategory) => {
    if (err || !updatedCategory) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: `Failed to remove ${category}`,
      });
    }
    res.json({
      message: `Successfully deleted ${category.name}`,
    });
  });
};
