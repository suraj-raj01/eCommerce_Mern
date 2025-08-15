const ChatMessage = require("../../models/chat/chatmessage");
const genAI = require("../../config/gemini");

const getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    await ChatMessage.create({ role: "user", message });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // change model name if needed

    const result = await model.generateContent(message);

    // Extract text safely
    let botReply = "";
    if (result?.response?.candidates?.length > 0) {
      botReply = result.response.candidates[0]?.content?.parts
        ?.map(part => part.text)
        .join(" ") || "";
    }

    // Save bot message
    await ChatMessage.create({ role: "bot", message: botReply });

    res.status(200).json({ reply: botReply });
  } catch (err) {
    console.error("Error in getChatResponse:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany();
    res.status(200).json({ message: "Chat history cleared successfully" });
  } catch (err) {
    console.error("Error clearing chat history:", err);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
};
 
module.exports = {
  getChatResponse,
  clearChatHistory
};
