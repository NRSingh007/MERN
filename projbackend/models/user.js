var mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

// entry point of creating new Schema
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true,
      maxlength: 40,
      trim: true,
    },

    lastName: {
      type: String,
      // required: true,
      maxlength: 40,
      trim: true,
    },

    userName: {
      type: String,
      required: true,
      unique: true,
      maxlength: 40,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    user_info: {
      type: String,
      trim: true,
    },

    encry_password: {
      // encry_password is the password that will be stored in the database
      type: String,
      required: true,
    },

    salt: String,

    role: {
      type: Number,
      default: 0,
    },

    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true } // records the exact time of the model creation
);

userSchema
  .virtual("password") // creating another field to the virtual "password"
  .set(function (password) {
    this._password = password; // here "_password" is used to make it as private variable
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  // creating methods
  authenticate: function (plainPassword) {
    // "authenticate, securePassword" is a named method, here we are using a regular way of declaring a function
    return this.securePassword(plainPassword) === this.encry_password;
  },

  securePassword: function (plainPassword) {
    // this function is gonna expect that we provide some of the password("plainPassword")
    // function passing a "plainPassword"
    if (!plainPassword) return "";
    try {
      return crypto // from node.js crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema); // exporting the "userSchema", naming it in short form as "User"
