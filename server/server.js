const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"]
  : true; // allow all in dev if not set

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ================= STATIC IMAGES ================= */

app.use("/images", express.static(path.join(__dirname, "images")));

/* ================= ROUTES ================= */

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const damageRoutes = require("./routes/damageRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const paymentRoutes=require("./routes/paymentRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/damage", damageRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/payment",paymentRoutes);

/* ================= TEST ================= */

app.get("/", (req, res) => {
  res.send("RentEase Backend Running...");
});

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});