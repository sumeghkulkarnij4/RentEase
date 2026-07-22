const Maintenance = require("../models/Maintenance");

// ================= CREATE REQUEST =================

exports.createRequest = async (req, res) => {
  try {
    const request = await Maintenance.create(req.body);

    res.status(201).json({
      success: true,
      message: "Maintenance request submitted successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= GET ALL REQUESTS =================

exports.getRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find().sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET SINGLE REQUEST =================

exports.getRequestById = async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= UPDATE STATUS =================

exports.updateStatus = async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = req.body.status;

    if (req.body.assignedTo)
      request.assignedTo = req.body.assignedTo;

    await request.save();

    res.json({
      success: true,
      message: "Status Updated Successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= DELETE REQUEST =================

exports.deleteRequest = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Maintenance Request Deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};