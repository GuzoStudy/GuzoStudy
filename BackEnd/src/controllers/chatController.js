// controllers/chatController.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY, // keep your key in .env
});

// POST /api/chat
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;

    res.json({ response: reply });
  } catch (error) {
    console.error("ChatController Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
