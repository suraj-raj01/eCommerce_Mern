const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("@dotenvx/dotenvx").config();
// import connectDB from "./config/db";

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
// connectDB();

// Import routes
const roleRoute = require("./routes/authentication/roles");
const permissionRoute = require("./routes/authentication/permission");
const userRoute = require("./routes/authentication/users");
const productCategoryRoute = require("./routes/products/categories");
const chatbotRoutes = require("./routes/chat/chatbotRoutes");
const uploadRoutes = require("./routes/products/upload");
const bilingCycle = require("./routes/products/billingcycle")
const planType = require("./routes/products/plantype")
const plans = require("./routes/products/plans");
// const Products = require('./routes/products/product')
// Root route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Status</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #6b73ff, #000dff);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 40px 60px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        p {
          font-size: 1.2rem;
        }
        span.rocket {
          font-size: 2rem;
          display: inline-block;
          animation: bounce 1.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Server is Running!</h1>
        <p>Port: <strong>${PORT}</strong> <span class="rocket">🚀</span></p>
      </div>
    </body>
    </html>
  `);
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
// app.use("/api/product", Products);

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
