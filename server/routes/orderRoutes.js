const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  updateReturnStatus,
  scheduleDelivery,
  updatePickupStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/orderController");

// User
router.post("/", createOrder);

router.get("/user/:userId", getOrders);

router.get("/:id", getSingleOrder);

router.put("/:id/cancel", cancelOrder);

// Admin
router.get("/admin/all", getAllOrders);

router.put("/:id/status", updateOrderStatus);

router.put("/:id/return", updateReturnStatus);

router.put("/:id/delivery", scheduleDelivery);

router.put("/:id/pickup", updatePickupStatus);

router.put("/:id/payment", updatePaymentStatus);

router.delete("/:id", deleteOrder);

module.exports = router;