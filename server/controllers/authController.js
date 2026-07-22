const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "rentease_jwt_secret_key_2026";

// ================= SIGNUP =================

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      profileImage: user.profileImage,
    };

    res.status(201).json({
      message: "Signup successful",
      token,
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: err.message,
    });
  }
};

// ================= LOGIN =================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked.",
        error: "Your account has been blocked.",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      profileImage: user.profileImage,
    };

    res.json({
      message: "Login successful",
      token,
      user: userObj,
      // Direct user properties for backwards compatibility
      ...userObj,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: err.message,
    });
  }
};

// ================= GET PROFILE =================

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: err.message,
    });
  }
};

// ================= UPDATE PROFILE =================

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    ).select("-password");

    res.json({
      message: "Profile Updated",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: err.message,
    });
  }
};