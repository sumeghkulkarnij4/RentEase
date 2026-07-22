const Order = require("../models/Order");

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      user,
      address,
      shippingAddress,
      deliveryDate,
      rentalStartDate,
      rentalEndDate,
      paymentMethod,
      paymentStatus,
      items,
      products,
      total,
      totalAmount,
    } = req.body;

    const finalUserId = userId || (user && (user._id || user.id));
    const rawItems = items || products || [];
    const finalTotal = total !== undefined ? total : (totalAmount || 0);

    if (!finalUserId || !Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order details: Missing userId or items array",
      });
    }

    // Map items to schema requirement
    const formattedItems = rawItems.map((item) => ({
      productId: item.productId || item._id || "",
      name: item.name || item.title || "Rental Item",
      rent: Number(item.rent || item.monthlyRent || item.price || 0),
      image: item.image || "",
      quantity: Number(item.quantity || 1),
      tenure: Number(item.tenure || 3),
    }));

    // Format address
    let formattedAddress = {};
    if (typeof address === "object" && address !== null) {
      formattedAddress = address;
    } else if (typeof shippingAddress === "object" && shippingAddress !== null) {
      formattedAddress = shippingAddress;
    } else {
      formattedAddress = {
        street: address || shippingAddress || "",
        fullName: req.body.fullName || "",
        phone: req.body.phone || "",
        city: req.body.city || "",
        state: req.body.state || "",
        pincode: req.body.pincode || "",
      };
    }

    const today = new Date();
    const futureDelivery = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const maxTenure = Math.max(...formattedItems.map(i => i.tenure), 3);
    const futureEnd = new Date(today.getTime() + maxTenure * 30 * 24 * 60 * 60 * 1000);

    const order = new Order({
      userId: finalUserId,
      address: formattedAddress,
      deliveryDate: deliveryDate || futureDelivery.toISOString().split("T")[0],
      rentalStartDate: rentalStartDate || today.toISOString().split("T")[0],
      rentalEndDate: rentalEndDate || futureEnd.toISOString().split("T")[0],
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentStatus || (paymentMethod === "Cash on Delivery" ? "Pending" : "Paid"),
      items: formattedItems,
      total: finalTotal,
      status: "Active",
      orderStatus: "Pending",
      returnStatus: "Not Returned",
      pickupStatus: "Pending",
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: err.message,
    });
  }
};

// ================= GET USER ORDERS =================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET ALL ORDERS =================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET SINGLE ORDER =================
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
// ================= UPDATE ORDER STATUS =================

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const newStatus = status || orderStatus;
    if (newStatus) {
      order.status = newStatus;
      order.orderStatus = newStatus;
    }

    await order.save();

    res.json({
      success: true,
      message: "Order Status Updated",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: err.message,
    });
  }
};

// ================= UPDATE RETURN STATUS =================

exports.updateReturnStatus = async (req, res) => {
  try {
    const { returnStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.returnStatus = returnStatus;

    await order.save();

    res.json({
      success: true,
      message: "Return Status Updated",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: err.message,
    });
  }
};

// ================= SCHEDULE DELIVERY =================

exports.scheduleDelivery = async (req, res) => {
  try {
    const { deliveryPartner, pickupDate, deliveryStatus, status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (deliveryPartner !== undefined) order.deliveryPartner = deliveryPartner;
    if (pickupDate !== undefined) order.pickupDate = pickupDate;

    const newStatus = deliveryStatus || status;
    if (newStatus) {
      order.status = newStatus;
      order.orderStatus = newStatus;
    }

    await order.save();

    res.json({
      success: true,
      message: "Delivery Scheduled Successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: err.message,
    });
  }
};

// ================= UPDATE PICKUP STATUS =================

exports.updatePickupStatus = async (req, res) => {
  try {
    const { pickupStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.pickupStatus = pickupStatus;

    await order.save();

    res.json({
      success: true,
      message: "Pickup Status Updated",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= UPDATE PAYMENT STATUS =================

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      success: true,
      message: "Payment Status Updated",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= CANCEL ORDER =================

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = "Cancelled";
    order.status = "Cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Order Cancelled Successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= DELETE ORDER =================

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};