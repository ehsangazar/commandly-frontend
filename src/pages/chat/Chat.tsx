import React from 'react';
import { useConfig } from '@/contexts/ConfigContext';

const Chat: React.FC = () => {
  const { chat } = useConfig();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-800">{chat || 'No message yet'}</p>
      </div>
    </div>
  );
};

export default Chat; 