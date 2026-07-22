/**
 * RentEase — Fix Old Products with Local Image Paths
 * ====================================================
 * Updates the 11 original products (sofa.jpg, fridge.jpg etc.)
 * to use production-ready Unsplash image URLs.
 * Also normalizes category names (Bedroom → Furniture).
 */

require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Map local filenames → production URLs + better descriptions
const localImageFixes = {
  "Sofa": {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    description: "Comfortable 3-seater sofa with premium fabric upholstery. Solid wood legs and deep cushioning for maximum relaxation.",
    category: "Furniture",
  },
  "3-Seater Sofa": {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    description: "Modern 3-seater sofa with clean lines and premium upholstery. Perfect for living rooms and lounges.",
    category: "Furniture",
  },
  "TV Unit": {
    image: "https://images.unsplash.com/photo-1616464916356-3a777b87d3b4?w=800&q=80",
    description: "Sleek TV entertainment unit with ample storage. Supports up to 60-inch TVs with open and closed storage compartments.",
    category: "Furniture",
  },
  "Coffee Table": {
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    description: "Minimalist coffee table with a glass top and powder-coated metal frame. Easy to clean and maintain.",
    category: "Furniture",
  },
  "Dining Table Set": {
    image: "https://images.unsplash.com/photo-1449247526672-61e49e49c5d7?w=800&q=80",
    description: "Classic wooden dining table set with 4 chairs. Solid wood construction with a warm walnut finish.",
    category: "Furniture",
  },
  "Queen Size Bed": {
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    description: "Queen size bed frame with padded headboard and under-bed storage. Elegant design in a warm wood finish.",
    category: "Furniture",
  },
  "Wardrobe": {
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
    description: "3-door sliding wardrobe with built-in mirror and internal shelves. Laminated finish with metal handles.",
    category: "Furniture",
  },
  "Mattress": {
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    description: "High-density foam mattress with orthopedic support. Comes in single, double, and queen sizes.",
    category: "Furniture",
  },
  "Refrigerator": {
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80",
    description: "Energy-efficient double door refrigerator with frost-free cooling and vegetable crisper.",
    category: "Appliances",
  },
  "Washing Machine": {
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
    description: "Front-loading washing machine with multiple wash programs and a quick wash mode.",
    category: "Appliances",
  },
  "Smart TV": {
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
    description: "Full HD Smart TV with Android OS and built-in streaming apps. Crisp display with powerful stereo sound.",
    category: "Electronics",
  },
};

async function fixOldProducts() {
  try {
    console.log("\n🔧  RentEase — Fix Old Products");
    console.log("══════════════════════════════════════");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB Atlas\n");

    let updated = 0;
    for (const [name, fixes] of Object.entries(localImageFixes)) {
      const product = await Product.findOne({ name });
      if (!product) {
        console.log(`   ℹ️  Not found: ${name}`);
        continue;
      }

      // Only fix if it still has a local image path
      if (!product.image || product.image.startsWith("http")) {
        console.log(`   ⏭  Already has URL image: ${name}`);
        continue;
      }

      product.image = fixes.image;
      product.description = fixes.description || product.description;
      product.category = fixes.category || product.category;
      await product.save();
      console.log(`   ✅  Fixed: ${name} → ${fixes.category}`);
      updated++;
    }

    console.log("\n══════════════════════════════════════");
    console.log(`✅  Products updated: ${updated}`);
    console.log("══════════════════════════════════════\n");

  } catch (err) {
    console.error("❌  Fix failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌  MongoDB connection closed.\n");
  }
}

fixOldProducts();
