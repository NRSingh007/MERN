const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;         // destructuring or pull out ObjectId, can refer to this ObjectId to whatever the schema we've created

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 40,
    },
    
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 30,
      maxlength: 3000,
    },
    
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },

    category: {                 // to link with previous schema that has already define
      type: ObjectId,
      ref: "Category",          // reference from where this ObjectId is coming from, referrence should be same as the export module name
      required: true,
    },
    
    stock: {
      type: Number,
    },
    
    sold: {
      type: Number,
      default: 0,
    },
    
    photo: {
      data: Buffer,              // images are stored in data which is buffer
      contentType: String,
    },
    
    rating: {
      default: 2.4,
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
