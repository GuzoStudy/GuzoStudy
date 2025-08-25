import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // Make sure this is in your .env file

export default function ChatBot() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey there 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatBodyRef = useRef();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botText =
        response.data.choices?.[0]?.message?.content || "Sorry, I got an error";

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "API Error. Check console.", error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Chatbot toggle button */}
      <button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-indigo-700 text-white flex items-center justify-center text-2xl"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        {showChatbot ? "×" : "💬"}
      </button>

      {/* Chatbot popup */}
      {showChatbot && (
        <div className="fixed bottom-24 right-8 w-96 bg-white rounded-xl shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-indigo-700 text-white rounded-t-xl">
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <button onClick={() => setShowChatbot(false)}>▼</button>
          </div>

          {/* Body */}
          <div
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-96"
            ref={chatBodyRef}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[70%] whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-indigo-700 text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start gap-2">
                <div className="p-3 rounded-lg max-w-[70%] bg-gray-100 text-gray-800 rounded-tl-sm">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse delay-200">.</span>
                  <span className="animate-pulse delay-400">.</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <form
            className="flex items-center p-3 border-t border-gray-200 gap-2"
            onSubmit={handleSend}
          >
            <textarea
              className="flex-1 p-2 border rounded-lg resize-none max-h-32"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-700 text-white p-2 rounded"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
