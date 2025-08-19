const ChatMessage = require("../../models/chat/chatmessage");
const genAI = require("../../config/gemini");

const getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    await ChatMessage.create({ role: "user", message });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // change model name if needed

    const prompt = `
You are a helpful assistant.
Always answer in Markdown format.

Format rules:
### Title
- Bullet point 1
- Bullet point 2
- Bullet point 3

User message: ${message}
`;


    const result = await model.generateContent(prompt);

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
