import React, { useState } from "react";
import { FiZap, FiSend } from "react-icons/fi";
import { useConfig } from "@/contexts/ConfigContext";
import { useNavigate } from "react-router-dom";

interface ChatWidgetProps {
  onSubmit?: (message: string) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState("");
  const { setChat } = useConfig();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setChat(message);
      if (onSubmit) {
        onSubmit(message);
      }
      setMessage("");
      navigate("/dashboard.html?chat=true");
    }
  };

  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-sm w-full">
      <div className="flex items-center justify-center gap-2 mb-2">
        <FiZap className="w-5 h-5 text-black" />
        <span className="text-lg text-black font-medium">
          How can I help you today?
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you want to know?"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 bg-[#7B68EE] text-white rounded-md hover:bg-[#6A5ACD] disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-10 h-10"
          title="Send message"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatWidget;
