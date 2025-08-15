const express = require("express");
const router = express.Router();
const chatcontroller = require("../../controllers/chatcontroller/chatbotController");

router.post("/chat", chatcontroller.getChatResponse);
router.delete("/clearchat", chatcontroller.clearChatHistory);

module.exports = router;
