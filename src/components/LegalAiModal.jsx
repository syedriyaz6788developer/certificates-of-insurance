import { useState } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true,
});

export default function LegalAiModal({ onClose }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a legal AI specialized in Certificate of Insurance (COI) compliance review.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      });

      const aiMessage = {
        role: "assistant",
        content: completion.choices[0].message.content,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setQuestion("");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-[2000]">
      <div className="w-full sm:w-[400px] bg-white h-full shadow-xl flex flex-col">

        <div className="p-4 border-b flex justify-between">
          <h3 className="font-semibold">LegalGraph AI</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-100"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <p className="text-sm text-gray-400">Thinking...</p>}
        </div>

        <div className="p-3 border-t flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="Ask about COI compliance..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            onClick={handleAsk}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
