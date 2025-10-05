const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("@dotenvx/dotenvx").config();

const app = express();

// Environment variables
const PORT = process.env.PORT || 8000;
const Database = process.env.DATABASE_URL;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(Database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Database Connected Successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

// Import routes
const roleRoute = require("./routes/authentication/roles");
const permissionRoute = require("./routes/authentication/permission");
const userRoute = require("./routes/authentication/users");
const productCategoryRoute = require("./routes/products/categories");
const chatbotRoutes = require("./routes/chat/chatbotRoutes");
const uploadRoutes = require("./routes/products/upload");
const bilingCycle = require("./routes/products/billingcycle")
const planType = require("./routes/products/plantype")
const plans = require("./routes/products/plans")
// Root route
app.get("/", (req, res) => {
  res.send("Hello, this is the Server Page");
});

// Mount routes
app.use("/api/roles", roleRoute);
app.use("/api/permission", permissionRoute);
app.use("/api/users", userRoute);
app.use("/api/category", productCategoryRoute);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads"))); // if storing local files
app.use("/api", chatbotRoutes);
app.use("/api/uploadcloudinary", uploadRoutes);
app.use("/api/billingcycle", bilingCycle);
app.use("/api/plantype", planType);
app.use("/api/plans", plans);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
