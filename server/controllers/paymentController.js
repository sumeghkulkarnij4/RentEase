const Razorpay = require("razorpay");
const crypto = require("crypto");

// Lazy getter — only instantiates when an actual payment request is made
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create(options);

    res.status(200).json(order);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Verify Payment Signature
exports.verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      return res.json({
        success: true,
        paymentId: razorpay_payment_id,
      });

    }

    res.status(400).json({
      success: false,
      message: "Invalid Signature",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};