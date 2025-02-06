const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const {
  login,
  signup,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
/*
    5 routes:
    GET /all users for user dashboard
    GET /user
    PUT /user
    DELETE /user
    POST /login
    POST /signup
*/

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    console.log(users);
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// get one user
router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const user = await getUser(id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send("User not found");
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// update user
router.put("/users/:id", async (req, res) => {
  try {
    // Retrieve id from URL
    const id = req.params.id;
    const role = req.body.role;
    // Pass in the data into the updateuser function
    const updatedUser = await updateUser(id, role);
    res.status(200).send(updatedUser);
  } catch (error) {
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// delete user
router.delete("/users/:id", async (req, res) => {
  try {
    // Retrieve the id from the URL
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const user = await getUser(id);
    // If the user does not exist
    if (!user) {
      /* !user because it is returning either a single object or null */
      return res.status(404).send({
        error: `Error: No match for a user found with the id "${id}".`,
      });
    }
    // Trigger the deleteuser function
    const status = await deleteUser(id);
    res.status(200).send({
      message: `Alert: user with the provided id #${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error._message,
    });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email);
    // login user via login function
    const user = await login(email, password);
    // send back the user data
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

// sign up route
router.post("/signup", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // create new user via signup function
    const user = await signup(name, email, password);
    // send back the newly created user data
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

module.exports = router;
