const express = require("express");

const router = express.Router();

const {
  createClaim,
  getClaims,
  getClaimById,
  updateClaimStatus,
  deleteClaim,
} = require("../controllers/damageController");

router.post("/", createClaim);

router.get("/", getClaims);

router.get("/:id", getClaimById);

router.put("/:id", updateClaimStatus);

router.delete("/:id", deleteClaim);

module.exports = router;