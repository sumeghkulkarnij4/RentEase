const express = require("express");

const router = express.Router();

const {
  getUsers,
  getSingleUser,
  toggleBlockUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/", getUsers);

router.get("/:id", getSingleUser);

router.put("/:id/block", toggleBlockUser);

router.delete("/:id", deleteUser);

module.exports = router;