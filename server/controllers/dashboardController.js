const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const DamageClaim = require("../models/DamageClaim");
const Maintenance = require("../models/Maintenance");

/* ===============================
   Dashboard Summary
================================ */

exports.getAnalytics = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const activeOrders = await Order.countDocuments({
      status: "Active",
    });

    const pendingMaintenance =
      await Maintenance.countDocuments({
        status: "Pending",
      });

    const pendingClaims =
      await DamageClaim.countDocuments({
        status: "Pending",
      });

    const revenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      activeOrders,
      pendingMaintenance,
      pendingClaims,
      revenue:
        revenue.length > 0
          ? revenue[0].totalRevenue
          : 0,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

/* ===============================
   Monthly Revenue
================================ */

exports.getRevenue = async (req, res) => {

  try {

    const revenue = await Order.aggregate([

      {
        $match: {
          paymentStatus: "Paid",
        },
      },

      {
        $group: {

          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$total",
          },

        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },

    ]);

    res.json(revenue);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

/* ===============================
   Monthly Rentals
================================ */

exports.getMonthlyRentals = async (req, res) => {

  try {

    const rentals = await Order.aggregate([

      {
        $group: {

          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          rentals: {
            $sum: 1,
          },

        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },

    ]);

    res.json(rentals);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

/* ===============================
   Category Distribution
================================ */

exports.getCategories = async (req, res) => {

  try {

    const categories = await Product.aggregate([

      {
        $group: {

          _id: "$category",

          count: {
            $sum: 1,
          },

        },
      },

    ]);

    res.json(categories);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

/* ===============================
   Top Products
================================ */

exports.getTopProducts = async (req, res) => {

  try {

    const products = await Product.find()

      .sort({
        rating: -1,
      })

      .limit(5);

    res.json(products);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};