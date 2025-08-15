const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "bot"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);
