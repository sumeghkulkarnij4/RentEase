const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

// Authentication
router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);

// User Profile
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);

module.exports = router;