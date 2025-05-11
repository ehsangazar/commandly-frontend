import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';

interface ChatWidgetProps {
  onSubmit?: (message: string) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSubmit) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-sm w-full max-w-[400px]">
      <div className="flex items-center justify-center gap-2 mb-2">
        <FiZap className="w-5 h-5 text-black" />
        <span className='text-lg text-black font-medium'>How can I help you today?</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you want to know?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
        />
      </form>
    </div>
  );
};

export default ChatWidget;