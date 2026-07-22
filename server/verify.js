require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const all = await Product.find({}, "name category rent image").sort({ category: 1, name: 1 });
  console.log(`\nTotal: ${all.length} products\n`);
  all.forEach((p, i) => {
    const imgType = p.image && p.image.startsWith("http") ? "🌐 Cloudinary/URL" : "📁 Local file";
    console.log(`${String(i+1).padStart(2)}. [${p.category}] ${p.name} — ₹${p.rent}/mo  ${imgType}`);
  });
  mongoose.connection.close();
});
