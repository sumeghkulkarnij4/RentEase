const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getCategories,
} = require("../controllers/productController");

// ================= PRODUCTS =================

// Get all products
router.get("/", getProducts);

// Get categories
router.get("/categories", getCategories);

// Get single product
router.get("/:id", getSingleProduct);

// Create product with image upload
router.post(
  "/",
  upload.single("image"),
  createProduct
);

// Update product with image upload
router.put(
  "/:id",
  upload.single("image"),
  updateProduct
);

// Update stock
router.put(
  "/:id/stock",
  updateStock
);

// Delete product
router.delete(
  "/:id",
  deleteProduct
);

module.exports = router;