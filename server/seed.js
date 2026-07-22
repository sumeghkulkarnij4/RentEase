/**
 * RentEase — Product Database Seeder
 * ====================================
 * Sources:
 * - Original image filenames recovered from server/images/ directory
 * - Product names inferred from git history image assets:
 *   sofa.jpg, bed.jpg, chair.jpg, table.jpg, wardrobe.jpg, fridge.jpg,
 *   tv.jpg, washing.jpg, dining.jpg, coffee.jpg, mattress.jpg, tvunit.jpg, sofa3.jpg
 * - 30 products generated across Furniture / Appliances / Electronics
 *
 * Usage:
 *   node server/seed.js
 *
 * Requires: MONGO_URI in server/.env
 */

require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const Product = require("./models/Product");

// ─── Curated Product Catalog ──────────────────────────────────────────────────
// Images use high-quality Unsplash URLs (works in production without Cloudinary)
// Matching original local filenames so existing local dev still works.

const products = [

  // ════════════════════════════════════════════
  //  FURNITURE  (12 products)
  // ════════════════════════════════════════════
  {
    name: "Premium 3-Seater Sofa",
    category: "Furniture",
    rent: 1299,
    deposit: 2500,
    tenureOptions: [3, 6, 12],
    description:
      "Luxurious 3-seater sofa with premium fabric upholstery and solid wood legs. Ergonomic backrest for maximum comfort. Ideal for living rooms and lounges.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    stock: 12,
    available: true,
    rating: 4.7,
    totalReviews: 89,
  },
  {
    name: "L-Shape Corner Sofa",
    category: "Furniture",
    rent: 1899,
    deposit: 3500,
    tenureOptions: [3, 6, 12],
    description:
      "Spacious L-shaped sectional sofa perfect for large living rooms. Features soft velvet fabric, deep cushions, and a sturdy frame.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    stock: 7,
    available: true,
    rating: 4.5,
    totalReviews: 54,
  },
  {
    name: "King Size Bed with Storage",
    category: "Furniture",
    rent: 1599,
    deposit: 3000,
    tenureOptions: [3, 6, 12],
    description:
      "King size bed frame with hydraulic storage underneath. Upholstered headboard with premium foam padding. Scratch-resistant finish.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    stock: 10,
    available: true,
    rating: 4.8,
    totalReviews: 112,
  },
  {
    name: "Queen Bed with Headboard",
    category: "Furniture",
    rent: 1199,
    deposit: 2200,
    tenureOptions: [3, 6, 12],
    description:
      "Elegant queen bed with tufted headboard. Made from engineered wood with a walnut finish. Easy assembly included.",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
    stock: 8,
    available: true,
    rating: 4.6,
    totalReviews: 78,
  },
  {
    name: "Premium Memory Foam Mattress",
    category: "Furniture",
    rent: 799,
    deposit: 1500,
    tenureOptions: [3, 6, 12],
    description:
      "High-density memory foam mattress with orthopedic support. Anti-bacterial and hypoallergenic cover. Available in Queen and King sizes.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    stock: 15,
    available: true,
    rating: 4.9,
    totalReviews: 203,
  },
  {
    name: "6-Seater Dining Table Set",
    category: "Furniture",
    rent: 1499,
    deposit: 3000,
    tenureOptions: [3, 6, 12],
    description:
      "Solid sheesham wood dining table with 6 cushioned chairs. Polished with a natural teak finish. Perfect for family dining rooms.",
    image: "https://images.unsplash.com/photo-1449247526672-61e49e49c5d7?w=800&q=80",
    stock: 6,
    available: true,
    rating: 4.6,
    totalReviews: 67,
  },
  {
    name: "Coffee Table with Glass Top",
    category: "Furniture",
    rent: 499,
    deposit: 1000,
    tenureOptions: [3, 6, 12],
    description:
      "Modern centre table with tempered glass top and metal frame. Features lower shelf for storage. Easy to clean and maintain.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    stock: 18,
    available: true,
    rating: 4.3,
    totalReviews: 41,
  },
  {
    name: "4-Door Wardrobe with Mirror",
    category: "Furniture",
    rent: 1099,
    deposit: 2000,
    tenureOptions: [3, 6, 12],
    description:
      "Spacious 4-door sliding wardrobe with full-length mirror. Ample storage with hanging space, shelves, and drawers. Laminated finish.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
    stock: 9,
    available: true,
    rating: 4.5,
    totalReviews: 62,
  },
  {
    name: "Ergonomic Study Chair",
    category: "Furniture",
    rent: 599,
    deposit: 1200,
    tenureOptions: [3, 6, 12],
    description:
      "High-back ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back. Ideal for work-from-home setups.",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
    stock: 20,
    available: true,
    rating: 4.7,
    totalReviews: 156,
  },
  {
    name: "Solid Wood Study Table",
    category: "Furniture",
    rent: 699,
    deposit: 1400,
    tenureOptions: [3, 6, 12],
    description:
      "Compact study/work desk made from solid wood with two drawers. Cable management cutout and anti-scratch surface. Available in walnut and white.",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    stock: 14,
    available: true,
    rating: 4.4,
    totalReviews: 48,
  },
  {
    name: "TV Unit with Storage",
    category: "Furniture",
    rent: 799,
    deposit: 1600,
    tenureOptions: [3, 6, 12],
    description:
      "Modern TV entertainment unit with open shelves and closed cabinets. Supports TVs up to 65 inches. Matt finish with metal handles.",
    image: "https://images.unsplash.com/photo-1616464916356-3a777b87d3b4?w=800&q=80",
    stock: 11,
    available: true,
    rating: 4.4,
    totalReviews: 37,
  },
  {
    name: "Single Bed with Trundle",
    category: "Furniture",
    rent: 899,
    deposit: 1800,
    tenureOptions: [3, 6, 12],
    description:
      "Space-saving single bed with a pull-out trundle underneath. Perfect for kids' rooms and guest bedrooms. Anti-tip safety design.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    stock: 8,
    available: true,
    rating: 4.2,
    totalReviews: 29,
  },

  // ════════════════════════════════════════════
  //  APPLIANCES  (10 products)
  // ════════════════════════════════════════════
  {
    name: "Double Door Refrigerator 350L",
    category: "Appliances",
    rent: 999,
    deposit: 2000,
    tenureOptions: [3, 6, 12],
    description:
      "350-litre frost-free double door refrigerator with inverter compressor. 5-star energy rating. Features include quick cool, vegetable crisper, and auto defrost.",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80",
    stock: 8,
    available: true,
    rating: 4.7,
    totalReviews: 134,
  },
  {
    name: "Single Door Refrigerator 180L",
    category: "Appliances",
    rent: 599,
    deposit: 1200,
    tenureOptions: [3, 6, 12],
    description:
      "Compact 180-litre single door refrigerator. Energy efficient with a direct cool system. Ideal for bachelors and small families.",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
    stock: 12,
    available: true,
    rating: 4.3,
    totalReviews: 67,
  },
  {
    name: "Front Load Washing Machine 7kg",
    category: "Appliances",
    rent: 899,
    deposit: 1800,
    tenureOptions: [3, 6, 12],
    description:
      "7kg front-loading washing machine with 15 wash programs. In-built heater, child lock, and quick wash mode. 5-star energy rating.",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
    stock: 10,
    available: true,
    rating: 4.8,
    totalReviews: 189,
  },
  {
    name: "Top Load Washing Machine 6kg",
    category: "Appliances",
    rent: 699,
    deposit: 1400,
    tenureOptions: [3, 6, 12],
    description:
      "6kg semi-automatic top load washing machine. Powerful pulsator motor, easy tub cleaning mode, and lint filter. Cost-effective choice.",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80",
    stock: 15,
    available: true,
    rating: 4.2,
    totalReviews: 58,
  },
  {
    name: "Microwave Oven 25L Convection",
    category: "Appliances",
    rent: 499,
    deposit: 1000,
    tenureOptions: [3, 6, 12],
    description:
      "25-litre convection microwave oven with grill and bake functions. Multi-stage cooking, auto cook menus, and child safety lock.",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
    stock: 20,
    available: true,
    rating: 4.5,
    totalReviews: 92,
  },
  {
    name: "1.5 Ton Split AC Inverter",
    category: "Appliances",
    rent: 1299,
    deposit: 2500,
    tenureOptions: [3, 6, 12],
    description:
      "1.5-ton 5-star inverter split AC with PM 2.5 filter, auto restart, and sleep mode. Ultra-quiet operation at 19dB. Comes with installation.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    stock: 6,
    available: true,
    rating: 4.9,
    totalReviews: 241,
  },
  {
    name: "Water Purifier with RO+UV",
    category: "Appliances",
    rent: 449,
    deposit: 900,
    tenureOptions: [3, 6, 12],
    description:
      "7-stage RO+UV+UF water purifier with mineralizer. 10-litre storage tank, TDS controller, and auto shutoff. Suitable for all water types.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80",
    stock: 25,
    available: true,
    rating: 4.6,
    totalReviews: 177,
  },
  {
    name: "Induction Cooktop 2-Burner",
    category: "Appliances",
    rent: 349,
    deposit: 700,
    tenureOptions: [3, 6, 12],
    description:
      "Double burner induction cooktop with touch controls and 7 power levels. Overheat protection, auto-off timer, and child lock feature.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    stock: 30,
    available: true,
    rating: 4.4,
    totalReviews: 83,
  },
  {
    name: "Ceiling Fan Premium 1200mm",
    category: "Appliances",
    rent: 249,
    deposit: 500,
    tenureOptions: [3, 6, 12],
    description:
      "1200mm high-speed premium ceiling fan with anti-dust blades and double ball bearing motor. Available in brown and ivory. Includes remote.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    stock: 35,
    available: true,
    rating: 4.3,
    totalReviews: 65,
  },
  {
    name: "Dishwasher 12 Place Setting",
    category: "Appliances",
    rent: 1099,
    deposit: 2200,
    tenureOptions: [3, 6, 12],
    description:
      "Free-standing dishwasher with 12 place settings. 6 wash programs, half-load option, and built-in water softener. Energy-efficient A+ rating.",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
    stock: 5,
    available: true,
    rating: 4.6,
    totalReviews: 44,
  },

  // ════════════════════════════════════════════
  //  ELECTRONICS  (8 products)
  // ════════════════════════════════════════════
  {
    name: '55" 4K Smart LED TV',
    category: "Electronics",
    rent: 1199,
    deposit: 2400,
    tenureOptions: [3, 6, 12],
    description:
      "55-inch 4K Ultra HD Smart LED TV with Android OS, Dolby Vision, and built-in Chromecast. Supports Netflix, Prime, and Hotstar out of the box.",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
    stock: 8,
    available: true,
    rating: 4.8,
    totalReviews: 213,
  },
  {
    name: '43" Full HD Smart TV',
    category: "Electronics",
    rent: 799,
    deposit: 1600,
    tenureOptions: [3, 6, 12],
    description:
      "43-inch Full HD Smart TV with Android OS. Dual speaker system, multiple HDMI and USB ports, and screen mirroring support.",
    image: "https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=800&q=80",
    stock: 12,
    available: true,
    rating: 4.5,
    totalReviews: 98,
  },
  {
    name: "Gaming Laptop i7 RTX 3060",
    category: "Electronics",
    rent: 2499,
    deposit: 5000,
    tenureOptions: [3, 6, 12],
    description:
      "High-performance gaming laptop with Intel Core i7, 16GB RAM, 512GB NVMe SSD, and NVIDIA RTX 3060. 144Hz IPS display. Perfect for gaming and creative work.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    stock: 5,
    available: true,
    rating: 4.9,
    totalReviews: 87,
  },
  {
    name: "Work Laptop i5 8GB RAM",
    category: "Electronics",
    rent: 1499,
    deposit: 3000,
    tenureOptions: [3, 6, 12],
    description:
      "Business-grade laptop with Intel Core i5, 8GB RAM, and 256GB SSD. Full HD display, fast charging, and Windows 11 Pro. Ideal for remote work.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    stock: 10,
    available: true,
    rating: 4.6,
    totalReviews: 142,
  },
  {
    name: "Bluetooth Speaker Portable",
    category: "Electronics",
    rent: 299,
    deposit: 600,
    tenureOptions: [3, 6, 12],
    description:
      "360° omnidirectional Bluetooth speaker with 20-hour battery life. IPX7 waterproof, built-in mic for calls, and party boost feature.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    stock: 30,
    available: true,
    rating: 4.5,
    totalReviews: 176,
  },
  {
    name: "Noise Cancelling Headphones",
    category: "Electronics",
    rent: 499,
    deposit: 1000,
    tenureOptions: [3, 6, 12],
    description:
      "Over-ear headphones with active noise cancellation, 30-hour playtime, and fast charging. Premium audio with deep bass and crystal-clear highs.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    stock: 20,
    available: true,
    rating: 4.7,
    totalReviews: 209,
  },
  {
    name: "Smart Home WiFi Router",
    category: "Electronics",
    rent: 349,
    deposit: 700,
    tenureOptions: [3, 6, 12],
    description:
      "Dual-band WiFi 6 router with speeds up to 3000Mbps. Covers up to 2500 sq ft. Parental controls, VPN support, and easy setup via app.",
    image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=80",
    stock: 25,
    available: true,
    rating: 4.4,
    totalReviews: 91,
  },
  {
    name: "HP LaserJet Printer",
    category: "Electronics",
    rent: 699,
    deposit: 1400,
    tenureOptions: [3, 6, 12],
    description:
      "Compact monochrome laser printer with wireless printing, scan, and copy functions. Fast print speed of 22 ppm. Compatible with mobile and cloud printing.",
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80",
    stock: 12,
    available: true,
    rating: 4.3,
    totalReviews: 57,
  },
];

// ─── Seed Function ─────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log("\n🌱  RentEase Product Seeder");
    console.log("══════════════════════════════════════");

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env — cannot connect to database.");
    }

    console.log("📡  Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB Atlas\n");

    let inserted = 0;
    let skipped = 0;

    for (const productData of products) {
      const existing = await Product.findOne({ name: productData.name });

      if (existing) {
        console.log(`   ⏭  Skipped (already exists): ${productData.name}`);
        skipped++;
      } else {
        await Product.create(productData);
        console.log(`   ✅  Inserted: ${productData.name}  [${productData.category}]  ₹${productData.rent}/mo`);
        inserted++;
      }
    }

    console.log("\n══════════════════════════════════════");
    console.log(`📦  Total products processed : ${products.length}`);
    console.log(`✅  Inserted                 : ${inserted}`);
    console.log(`⏭  Skipped (duplicates)     : ${skipped}`);
    console.log("══════════════════════════════════════");
    console.log("🎉  Seeding complete!\n");

  } catch (err) {
    console.error("\n❌  Seeding failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌  MongoDB connection closed.\n");
  }
}

seed();
