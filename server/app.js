const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Environment variables
const PORT = process.env.PORT || 8000;
const Database = process.env.DATABASE_URL || "mongodb+srv://surajkumarbgu555:RCGboeI5eaust2ET@cluster0.enw65fr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(Database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Database Connected Successfully!");
})
.catch((err) => {
  console.error("❌ Database connection failed:", err.message);
});

// Import routes
const roleRoute = require("./routes/authentication/roles");
const permissionRoute = require("./routes/authentication/permission");
const userRoute = require("./routes/authentication/users");
const productCategoryRoute = require("./routes/products/categories")

// Root route
app.get("/", (req, res) => {
  res.send("Hello, this is the Server Page");
});

// Mount routes
app.use("/api/roles", roleRoute); 
app.use("/api/permission", permissionRoute); 
app.use("/api/users", userRoute); 
app.use("/api/category", productCategoryRoute); 

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
