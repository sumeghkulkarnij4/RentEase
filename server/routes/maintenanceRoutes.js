const express = require("express");

const router = express.Router();

const {
  createRequest,
  getRequests,
  getRequestById,
  updateStatus,
  deleteRequest,
} = require("../controllers/maintenanceController");

router.post("/", createRequest);

router.get("/", getRequests);

router.get("/:id", getRequestById);

router.put("/:id", updateStatus);

router.delete("/:id", deleteRequest);

module.exports = router;