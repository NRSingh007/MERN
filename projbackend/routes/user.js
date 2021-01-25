const express = require("express");
const router = express.Router();

const { getUserById, getUser } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");


// this method will populate automatically req.profile object with user object that is coming up from the DB
router.param("/userId", getUserById); // this will populate the req.profile

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

module.exports = router;
