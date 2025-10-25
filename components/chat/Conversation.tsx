import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, ChatMessage } from '../../types';
import * as api from '../../services/api';
import { Send, Phone, Video, Paperclip, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ConversationProps {
  otherUser: User;
}

const Conversation: React.FC<ConversationProps> = ({ otherUser }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const history = await api.getChatHistory(user.id, otherUser.id);
      setMessages(history);
      api.markMessagesAsRead(user.id, otherUser.id);
    };
    fetchHistory();
  }, [user, otherUser.id]);

  useEffect(() => {
    const handleNewMessage = (event: Event) => {
      const msg = (event as CustomEvent).detail as ChatMessage;
      if (
        (msg.fromUserId === user?.id && msg.toUserId === otherUser.id) ||
        (msg.fromUserId === otherUser.id && msg.toUserId === user?.id)
      ) {
        setMessages((prev) => [...prev, msg]);
        if (msg.fromUserId === otherUser.id && document.hasFocus()) {
            api.markMessagesAsRead(user!.id, otherUser.id);
        }
      }
    };

    window.addEventListener('newMessage', handleNewMessage);
    return () => window.removeEventListener('newMessage', handleNewMessage);
  }, [user, otherUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;
    await api.sendMessage(user.id, otherUser.id, { text: newMessage.trim() });
    setNewMessage('');
  };
  
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
        const file = e.target.files[0];
        await api.sendMessage(user.id, otherUser.id, { file });
        e.target.value = ''; // Reset file input to allow selecting the same file again
    }
  };


  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex items-center justify-between p-3 border-b bg-white shadow-sm shrink-0">
        <h3 className="font-semibold text-gray-800">{otherUser.name}</h3>
        <div className="flex items-center space-x-3">
          <button className="text-gray-500 hover:text-blue-600" title={t('call')}><Phone size={20} /></button>
          <button className="text-gray-500 hover:text-blue-600" title={t('videoCall')}><Video size={20} /></button>
          <button onClick={handleAttachmentClick} className="text-gray-500 hover:text-blue-600" title={t('sendDocument')}><Paperclip size={20} /></button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.fromUserId === user.id;
          const bubbleClasses = isMe ? 'bg-blue-500 text-white' : 'bg-white text-gray-800';
          const timestampClasses = isMe ? 'text-blue-200' : 'text-gray-400';

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md rounded-lg shadow ${bubbleClasses}`}>
                
                {msg.file && msg.fileType?.startsWith('image/') ? (
                  <div className="p-1">
                    <a href={msg.file} target="_blank" rel="noopener noreferrer">
                      <img src={msg.file} alt={msg.fileName || 'shared image'} className="max-w-full h-auto max-h-64 object-cover rounded-md" />
                    </a>
                  </div>
                ) : msg.file ? (
                  <a href={msg.file} download={msg.fileName} className="flex items-center p-3 gap-3">
                    <FileText size={24} className="flex-shrink-0"/>
                    <span className="text-sm font-medium break-all">{msg.fileName || 'Shared File'}</span>
                  </a>
                ) : null}
                
                {msg.text && (
                  <p className="text-sm break-words px-3 py-2">{msg.text}</p>
                )}

                <p className={`text-xs mt-1 text-right px-2 pb-1 ${timestampClasses}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-3 border-t bg-white shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('typeMessage')}
            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label={t('typeMessage')}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 shrink-0" aria-label={t('sendMessage')}>
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Conversation;