const express = require("express");
const {
  registerUser,
  checkLogin,
} = require("../controllers/authController"); // Import the controller function

const router = express.Router(); // Create a new Express router

// Define the /register route
router.post("/register", registerUser); // Route for registering a user
router.post("/login", checkLogin);
// set up a wordbank for the user
// router.post("/wordbank", addWordbank);
module.exports = router; // Export the router as the module
