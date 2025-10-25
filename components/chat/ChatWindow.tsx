import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import * as api from '../../services/api';
import UserList from './UserList';
import Conversation from './Conversation';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const ChatWindow: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    
    useEffect(() => {
        if (!user) return;
        const fetchUsers = async () => {
            const users = await api.getAllUsers();
            setAllUsers(users.filter(u => u.id !== user.id));
            const onlineUsers = await api.getOnlineUsers(user.id);
            setOnlineUserIds(onlineUsers);
        };
        fetchUsers();
    }, [user]);

    const updateUnreadCounts = useCallback(() => {
        if (user) {
            const counts = api.getUnreadMessageCounts(user.id);
            setUnreadCounts(counts);
        }
    }, [user]);
    
    useEffect(() => {
        updateUnreadCounts();

        const handleMessageEvents = () => updateUnreadCounts();
        window.addEventListener('newMessage', handleMessageEvents);
        window.addEventListener('messagesRead', handleMessageEvents);

        return () => {
            window.removeEventListener('newMessage', handleMessageEvents);
            window.removeEventListener('messagesRead', handleMessageEvents);
        };
    }, [updateUnreadCounts]);

    const handleSelectUser = (userId: string) => {
        setSelectedUserId(userId);
        if(user) {
            api.markMessagesAsRead(user.id, userId);
        }
    };
    
    const selectedUser = allUsers.find(u => u.id === selectedUserId);

    return (
        <div className="fixed bottom-20 right-8 w-[90vw] h-[70vh] max-w-4xl max-h-[600px] bg-white rounded-lg shadow-2xl flex z-40 overflow-hidden border">
            <aside className="w-1/3 md:w-1/3 border-r">
                <UserList 
                    users={allUsers}
                    onlineUserIds={onlineUserIds}
                    unreadCounts={unreadCounts}
                    selectedUserId={selectedUserId}
                    onSelectUser={handleSelectUser}
                />
            </aside>
            <section className="w-2/3 md:w-2/3 flex flex-col">
                {selectedUser ? (
                    <Conversation otherUser={selectedUser} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-50">
                        <MessageSquare size={48} className="mb-4" />
                        <h2 className="text-lg font-semibold">{t('selectContact')}</h2>
                        <p className="text-sm">{t('selectContactSubtitle')}</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ChatWindow;
