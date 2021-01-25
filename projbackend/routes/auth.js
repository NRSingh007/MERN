var express = require("express");
var router = express.Router(); // importing router from express
var { check, body, validationResult } = require("express-validator");

const { login, isSignedIn } = require("../controllers/auth");
const { signout, signup } = require("../controllers/auth"); // importing the "signout" from the controller
const User = require("../models/user");

router.post(
  "/login",
  [
    check("email", "Enter a valid email!").isEmail(),
    check("password", "Password cannot be empty!").isLength({ min: 1 }),
  ],
  login
);

router.get("/signout", signout);

router.post(
  "/signup",
  [
    check("userName", "UserName should be between 3 to 40 character").isLength({
      min: 3,
      max: 40,
    }),

    check("email", "Enter a valid email").isEmail(),

    check(
      "password",
      "Password should be minimum of 8 characters, Alphanumeric, must contain atleast one special character and uppercase"
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  ],
  signup
);

// router.get("/testRoute", isSignedIn, (req, res) => {
//   res.json(req.auth);
// });

module.exports = router; // exporting the router module
