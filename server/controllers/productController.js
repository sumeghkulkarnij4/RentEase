const Product = require("../models/Product");

// ================= GET ALL PRODUCTS =================

exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minRent,
      maxRent,
      available,
    } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (available !== undefined) {
      filter.available = available === "true";
    }

    if (minRent || maxRent) {
      filter.rent = {};

      if (minRent) {
        filter.rent.$gte = Number(minRent);
      }

      if (maxRent) {
        filter.rent.$lte = Number(maxRent);
      }
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET SINGLE PRODUCT =================

exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= CREATE PRODUCT =================

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      rent,
      deposit,
      tenureOptions,
      description,
      stock,
      available,
    } = req.body;

    const existing = await Product.findOne({
      name,
    });

    if (existing) {
      return res.status(400).json({
        message: "Product already exists",
      });
    }

    const image = req.file
      ? req.file.path
      : "";

    const product = await Product.create({
      name,
      category,
      rent,
      deposit,
      tenureOptions,
      description,
      image,
      stock,
      available,
    });

    res.status(201).json({
      message: "Product Added Successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
// ================= UPDATE PRODUCT =================

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const {
      name,
      category,
      rent,
      deposit,
      tenureOptions,
      description,
      stock,
      available,
    } = req.body;

    product.name = name ?? product.name;
    product.category = category ?? product.category;
    product.rent = rent ?? product.rent;
    product.deposit = deposit ?? product.deposit;
    product.tenureOptions =
      tenureOptions ?? product.tenureOptions;
    product.description =
      description ?? product.description;
    product.stock = stock ?? product.stock;
    product.available =
      available ?? product.available;

    // Update image only if a new one is uploaded
    if (req.file) {
      product.image = req.file.path;
    }

    await product.save();

    res.json({
      message: "Product Updated Successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= DELETE PRODUCT =================

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= UPDATE STOCK =================

exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          stock,
          available: Number(stock) > 0,
        },
        {
          new: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Stock Updated Successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
// ================= GET PRODUCT CATEGORIES =================

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct(
      "category"
    );

    res.json(categories);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};