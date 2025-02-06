const express = require("express");
const mongoose = require("mongoose");
//create a router for products
const router = express.Router();

const {
  getCars,
  getCar,
  addNewCar,
  updateCar,
  deleteCar,
} = require("../controllers/car");

// get all the cars. Pointing to /cars
router.get("/", async (req, res) => {
  try {
    const category = req.query.category;
    const page = req.query.page;
    const per_page = req.query.per_page;
    const cars = await getCars(category, page, per_page);
    res.status(200).send(cars);
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// get one car by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const car = await getCar(id);
    if (car) {
      res.status(200).send(car);
    } else {
      res.status(400).send("Car not Found");
    }
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// add new car
router.post("/", async (req, res) => {
  try {
    // Retrieve the data from req.body
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    const image = req.body.image;
    // Check for errors
    if (!name || !price || !category) {
      return res.status(400).send({
        error: "Error: Required car data is missing!",
      });
    }
    // If no errors, pass in all the data to addNewCar function from controller
    const newCar = await addNewCar(name, description, price, category, image);
    res.status(200).send(newCar);
  } catch (error) {
    console.log(error);
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// edit car
router.put("/:id", async (req, res) => {
  try {
    // Retrieve id from URL
    const id = req.params.id;
    // Retrieve the data from req.body
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    const image = req.body.image;
    // Pass in the data into the updateCar function
    const updatedCar = await updateCar(
      id,
      name,
      description,
      price,
      category,
      image
    );
    res.status(200).send(updatedCar);
  } catch (error) {
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// delete car
router.delete("/:id", async (req, res) => {
  try {
    // Retrieve the id from the URL
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const car = await getCar(id);
    // If the product does not exist
    if (!car) {
      /* !product because it is returning either a single object or null */
      return res.status(404).send({
        error: `Error: No match for a car found with the id "${id}".`,
      });
    }
    // Trigger the deleteCar function
    const status = await deleteCar(id);
    res.status(200).send({
      message: `Alert: Car with the provided id #${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

module.exports = router;
