const DamageClaim = require("../models/DamageClaim");

// ================= CREATE DAMAGE CLAIM =================

exports.createClaim = async (req, res) => {
  try {

    const claim = await DamageClaim.create(req.body);

    res.status(201).json({
      success: true,
      message: "Damage Claim Submitted Successfully",
      claim,
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
};

// ================= GET ALL CLAIMS =================

exports.getClaims = async (req, res) => {
  try {

    const claims = await DamageClaim.find().sort({
      createdAt: -1,
    });

    res.json(claims);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
};

// ================= GET SINGLE CLAIM =================

exports.getClaimById = async (req, res) => {
  try {

    const claim = await DamageClaim.findById(
      req.params.id
    );

    if (!claim) {
      return res.status(404).json({
        message: "Damage Claim Not Found",
      });
    }

    res.json(claim);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
};

// ================= UPDATE CLAIM STATUS =================

exports.updateClaimStatus = async (req, res) => {
  try {

    const claim = await DamageClaim.findById(
      req.params.id
    );

    if (!claim) {
      return res.status(404).json({
        message: "Damage Claim Not Found",
      });
    }

    claim.status = req.body.status;

    if (req.body.estimatedAmount !== undefined)
      claim.estimatedAmount =
        req.body.estimatedAmount;

    await claim.save();

    res.json({
      success: true,
      message: "Damage Claim Updated Successfully",
      claim,
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
};

// ================= DELETE CLAIM =================

exports.deleteClaim = async (req, res) => {
  try {

    await DamageClaim.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Damage Claim Deleted Successfully",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
};