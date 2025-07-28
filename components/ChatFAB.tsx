import React from 'react';
import { MessageSquareIcon } from './Icons';

interface ChatFABProps {
  onClick: () => void;
}

const ChatFAB: React.FC<ChatFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group"
      aria-label="Open Samvad AI Assistant"
    >
      <MessageSquareIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
    </button>
  );
};

export default ChatFAB;
