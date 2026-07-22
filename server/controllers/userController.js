const User = require("../models/User");

// ================= GET USERS =================

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET SINGLE USER =================

exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= BLOCK / UNBLOCK =================

exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      message: user.isBlocked
        ? "User Blocked Successfully"
        : "User Unblocked Successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= DELETE USER =================

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};