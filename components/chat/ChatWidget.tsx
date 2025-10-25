import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as api from '../../services/api';
import ChatWindow from './ChatWindow';
import { MessageSquare, X } from 'lucide-react';

const ChatWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    const updateUnreadCount = () => {
      const counts = api.getUnreadMessageCounts(user.id);
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      setTotalUnread(total);
    };

    updateUnreadCount();
    
    window.addEventListener('newMessage', updateUnreadCount);
    window.addEventListener('messagesRead', updateUnreadCount);

    return () => {
        window.removeEventListener('newMessage', updateUnreadCount);
        window.removeEventListener('messagesRead', updateUnreadCount);
    };
  }, [user]);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-50 transition-transform hover:scale-110"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>
      {isOpen && <ChatWindow />}
    </>
  );
};

export default ChatWidget;
