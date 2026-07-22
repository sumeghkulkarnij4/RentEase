const express = require("express");

const router = express.Router();

const {

  getAnalytics,

  getRevenue,

  getMonthlyRentals,

  getCategories,

  getTopProducts,

} = require("../controllers/dashboardController");

router.get("/analytics", getAnalytics);

router.get("/revenue", getRevenue);

router.get("/monthly", getMonthlyRentals);

router.get("/categories", getCategories);

router.get("/top-products", getTopProducts);

module.exports = router;