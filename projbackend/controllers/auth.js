require("dotenv").config();
const User = require("../models/user"); // recommended that the variable name use is similar to that of exports model
const { check, body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");


exports.signup = (req, res) => {
  // creating error or populating error
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      // validation error (express-validator)
      error: errors.array()[0].msg,
      // error: errors.array()[1].param,
    });
  }

  // the small case "user" will be the object of the class "User"
  const user = new User(req.body); // the object will be populated by the "req.body"

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "User NOT SAVE",
      });
    }

    // User.findOne({ userName: userName }).then((userName) => {
    //   if (userName != null) {
    //     return res.status(400).json({
    //       error: "userName already exist! Try different",
    //     });
    //   }
    // });

    // res.json(user);                              // this will throw the whole user database

    // to send selective user DB we need to destructured into objects
    res.json({
      username: user.userName,
      email: user.email,
      id: user._id, // this has to "user._id"
    });
  });
};

exports.login = (req, res) => {
  const errors = validationResult(req);

  const { email, password } = req.body; // destructuring of data, from body extracting email and password

  if (!errors.isEmpty()) {
    return res.status(401).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "The email does not exists",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        // returning so that there is no further execution of the code if the condition is matched
        error: "Entered email and password does not match!!",
      });
    }

    // creating a token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET); // creating based on "_id" which is a key value pair

    // Put token into user cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send res to FrontEnd
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    // sending the "json" response message instead of normal message
    message: "User has signout successfully", // throwing the key value pair inside the object
  });
  return res.status(200).redirect("/login");
};

// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role
  };

  return getUserInfo;
};

// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth", // setting properties at user browser
});

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;  // the property "profile" is set from the frontend and is only going to be set if the user is logged in
  // console.log("auth", req.auth);

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Not Admin, ACCESS DENIED!!",
    });
  }
  next();
};
