const User = require("../models/user");
const Order = require("../models/order");

// exports.getUserById = (req, res, next, id) => {
//   User.findById(id).exec((err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         error: "No user was found in DB",
//       });
//     }
//     req.profile = user; // storing the user inside the request object called as "profile"
//     next();
//   });
// };

exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      req.profile = user;
    })
    .catch((err) => {
      res.status(401).json({ error: "No user in DB" });
    });
  next();
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;

  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body }, // to update we need to pass them in the "$set"
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Update user unsuccessful",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name") // the first is the model or the object to update, 2nd is the fills that we need
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order found for this account",
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  // As the purchase is in array, we will be using push
  let purchases = []; // storing it into local purchases array
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantify: product.quantify,
      amount: req.body.order.amount,
      transactions_id: req.body.order.transactions_id,
    });
  });

  // storing into mongodb
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } }, // "$push" as this is an array
    { new: true }, // "new: true" so that it will show the updated purchase
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};

// exports.getAllUsers = (req, res) => {
//   User.find().exec((err, users) => {
//     if (err || !users) {
//       return res.status(400).json({
//         error: "No users found in the DB",
//       });
//     }
//     // for (i in users) {
//     //   i.salt = undefined;
//     //   i.encry_password = undefined;
//     //   // res.json(users);
//     // }

//     res.json(users);
//   });
// };

// exports.getAllUsers = (req, res) => {
//   User.find({ User })
//     .then((user) => {
//       res.json(user);
//     })
//     .catch((err) => res.status(401).json({ error: "No user found in the DB" }));
// };
