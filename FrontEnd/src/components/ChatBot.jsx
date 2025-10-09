import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, Paperclip, Smile } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // temporary "thinking..."
    const thinkingId = Date.now();
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "thinking...", id: thinkingId, thinking: true },
    ]);

    try {
      // call backend API
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      // replace "thinking..." with actual response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId ? { sender: "bot", text: data.reply } : m
        )
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? { sender: "bot", text: "⚠️ Error connecting to server." }
            : m
        )
      );
    }
  };

  return (
    <div>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-indigo-600 text-black px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-full">
                <Bot className="text-indigo-600" size={20} />
              </div>
              <span className="font-semibold text-lg">Chatbot</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "items-start gap-2"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white flex-shrink-0">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-xl max-w-[75%] text-sm ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-indigo-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.thinking ? (
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="p-3 border-t flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <Smile size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
