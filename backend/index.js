require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Product Schema & Model
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  brand: String,
  price: Number,
  currency: String,
  categories: String,
  sustainability_labels: String,
  gender: String,
  url: String,
  image_urls: String,
  colors: String,
  product_text: String
}, { 
  collection: 'newCollection',
  // This tells Mongoose not to enforce strict schema validation
  // since your documents have many fields
  strict: false
});

const Product = mongoose.model("Product", productSchema);

// 🔹 Route 1: Search for Products by Keywords (Array of Keywords)
app.post("/search", async (req, res) => {
  try {
    const { keywords } = req.body;

    console.log("Received keywords:", keywords);

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: "Keywords must be a non-empty array" });
    }

    // Construct an array of regex conditions for case-insensitive whole word search
    const regexConditions = keywords.map((kw) => ({
      name: { $regex: `\\b${kw}\\b`, $options: "i" },
    }));

    // Perform the search using the $or operator
    const results = await Product.find({ $or: regexConditions })
      .limit(5)
      .exec();

    console.log("the results are :", results);
    res.json(results);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Add this endpoint to check if you have products
app.get("/products/count", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔹 Route 2: Get Product by ID
app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Invalid product ID or server error" });
  }
});

// 🔹 Route 3: Health Check
app.get("/health", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Not Connected";
    
    res.json({
      server: "Running",
      database: dbStatus,
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ server: "Error", database: "Unknown" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
