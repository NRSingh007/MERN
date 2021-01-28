require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// My Routes
const authRoutes = require("./routes/auth"); // calling the routes for authentication
const userRoutes = require("./routes/user"); // calling the routes for users
const categoryRoutes = require("./routes/category"); // calling the routes for category
const productRoutes = require("./routes/product");

// DB connection
// keeping the connection chaining
// myFun.run().then().catch()...........then() runs when there is a success, catch() runs when there is an error
// ecomm -------- Database name
// process------where all the dependencies are created and environment variable are attached
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // to keep the database connection alive
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("CORRUPTED DB");
  });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My routes
app.use("/api", authRoutes); // creating api, "/api" has to use(write in route) to interact with backend
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

// Port
const port = process.env.PORT || 8000;

// Starting a server
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
