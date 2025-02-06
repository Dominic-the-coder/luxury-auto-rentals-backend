require("dotenv").config();
// import express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create the express app
const app = express();

// middleware to handle JSON request
app.use(express.json());

// setup cors policy
app.use(cors());

// set a folder as a static path
app.use("/api/uploads", express.static("uploads"));

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL + "/car_rental")
  .then(() => {
    // if mongodb is successfully connected
    console.log("MongoDB is connected");
  })
  .catch((error) => {
    console.log(error);
  });

// root route
app.get("/", (req, res) => {
  res.send("Happy coding!");
});

app.use("/api/cars", require("./routes/car"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/rents", require("./routes/rent"));
app.use("/api/auth", require("./routes/user"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/image", require("./routes/image"));

// start the server
app.listen(5555, () => {
  console.log("Server is running at http://localhost:5555");
});
