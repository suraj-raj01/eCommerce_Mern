const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Environment variables
const PORT = process.env.PORT || 8000;
const Database = process.env.DATABASE_URL || "mongodb://localhost:27017/surajmern";

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

// Root route
app.get("/", (req, res) => {
  res.send("Hello, this is the Server Page");
});

// Mount routes
app.use("/api/roles", roleRoute); 
app.use("/api/permission", permissionRoute); 

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
