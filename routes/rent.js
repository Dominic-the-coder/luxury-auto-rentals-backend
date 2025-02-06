const express = require("express");
const mongoose = require("mongoose");
// set up the order router
const router = express.Router();
// import all the order functions
const {
  getRents,
  getRent,
  addNewRent,
  updateRent,
  deleteRent,
  getRentsFilter,
} = require("../controllers/rent");
const { isValidUser } = require("../middleware/auth");

/*
    GET /rents
    POST /rents
    PUT /rents/:id
    DELETE /rents/:id
*/

// GET /rents
router.get("/", isValidUser, async (req, res) => {
  try {
    const email = req.user.email;
    const role = req.user.role;
    console.log(email, role);
    const rents = await getRents(email, role);
    res.status(200).send(rents);
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// POST /rents - create new rent
router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, car, totalPrice, rent, rentD } =
      req.body;
    console.log(customerName, customerEmail, car, totalPrice);

    const newRent = await addNewRent(
      customerName,
      customerEmail,
      car,
      totalPrice,
      rent,
      rentD
    );

    res.status(200).send(newRent);
  } catch (error) {
    console.error("Error creating rent:", error); // Logs full error details
    res.status(400).send({
      error: error.message || "An unknown error occurred",
    });
  }
});

// GET /rents/filter - for the filtering part
router.get("/filter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).send(await getRentsFilter(id));
  } catch (error) {
    res.status(400).send({
      error: error.message || "An unknown error occurred",
    });
  }
});

// PUT /rents/:id - update the rent status
router.put("/:id", async (req, res) => {
  try {
    // Retrieve id from URL
    const id = req.params.id;
    // Retrieve the data from req.body
    const status = req.body.status;
    // Pass in the data into the updateRent function
    const updatedRent = await updateRent(id, status);
    res.status(200).send(updatedRent);
  } catch (error) {
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// DELETE /rents/:id - delete the rent
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
    const rent = await getRent(id);
    // If the rent does not exist
    if (!rent) {
      /* !order because it is returning either a single object or null */
      return res.status(404).send({
        error: `Error: No match for a rent found with the id "${id}".`,
      });
    }
    // Trigger the deleteRent function
    const status = await deleteRent(id);
    res.status(200).send({
      status: "success",
      message: `Rent with the provided id #${id} has been deleted`,
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
