const Product = require("../models/Product");

exports.getRecommendations = async (req, res) => {
  try {
    const { category } = req.params;

    const recommendations = await Product.find({
      category,
    })
      .sort({ rating: -1 })
      .limit(4);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};