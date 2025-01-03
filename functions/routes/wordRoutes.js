const express = require("express");
const { body } = require("express-validator"); // Import body from express-validator

const {
  fetchWordbanks,
  createWordbank,
  addWordsToWordbank,
  getWordsFromCurrentWordbank,
  updateWords,
  lookupWord,
  testFunction, // Assuming this function updates a word's metadata like rightTimes/wrongTimes
  setCurrentWordbank,
  getCurrentWordbank,
} = require("../controllers/wordController");

const { verifyToken } = require("../controllers/authController");
const router = express.Router();

// Routes related to wordbanks
router.get("/wordbanks", verifyToken, fetchWordbanks); // Fetch all wordbanks for a user
router.post("/wordbanks", verifyToken, createWordbank); // Create a new wordbank

// Routes related to words within a specific wordbank
router.post("/wordbanks/add-words", verifyToken, addWordsToWordbank); // Add words to a specific wordbank
router.get(
  "/getwords_currentwordbanks",
  verifyToken,
  getWordsFromCurrentWordbank
); // Get words from a specific wordbank

// Update a specific word within a user's wordbank
router.put("/wordbanks/:wordbankId", verifyToken, updateWords); // Update a specific word
router.post("/lookupword", verifyToken, lookupWord); // Update a specific word

router.post("/setcurrentwordbank", verifyToken, setCurrentWordbank);
router.get("/getcurrentwordbank", verifyToken, getCurrentWordbank);

router.post("/test", verifyToken, testFunction);
module.exports = router;
