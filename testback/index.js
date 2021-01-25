const express = require("express");

const app = express();

// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const port = 8000;

app.get("/", (req, res) => {
  // callback method
  return res.send("Hello World!");
});

app.get("/new", (req, res) => {
  // callback method
  return res.send("NEW!!");
});

// calling method with a call back function
// app.get("/admin", (req, res) => {
//     return res.send("This is admin page");
// });

// Declaring a variable which is holding a method
const admin = (req, res) => {
  return res.send("This is admin dashboard");
};
const isAdmin = (req, res, next) => {
  console.log("isAdmin is running");
  next();       // custom middleware
};
const isLoggedIn = (req, res, next) => {        // next method has to define here else it will show an error for not defining
    console.log("The Admin has Logged In");
    next();
};
app.get("/admin", isLoggedIn, isAdmin, admin);

app.listen(port, () => {
  console.log("Server is up and running...");
});
