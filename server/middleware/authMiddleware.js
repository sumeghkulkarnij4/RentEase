const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "rentease_jwt_secret_key_2026";

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({
      message: "Access Denied",
    });

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin Access Only",
    });
  }

  next();
};