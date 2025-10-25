import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { NotificationType } from '../../types';
import { Bell, MessageSquare, ClipboardCheck, Info, Settings, Trash2 } from 'lucide-react';

const NotificationIcon: React.FC<{type: NotificationType}> = ({ type }) => {
    switch (type) {
        case NotificationType.CHAT: return <MessageSquare className="w-5 h-5 text-blue-500" />;
        case NotificationType.TASK: return <ClipboardCheck className="w-5 h-5 text-green-500" />;
        case NotificationType.SYSTEM: return <Info className="w-5 h-5 text-yellow-500" />;
        default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
}

const formatTimestamp = (timestamp: number, t: (key: string, vars?: any) => string): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return t('yearsAgo', { count: Math.floor(interval) });
    interval = seconds / 2592000;
    if (interval > 1) return t('monthsAgo', { count: Math.floor(interval) });
    interval = seconds / 86400;
    if (interval > 1) return t('daysAgo', { count: Math.floor(interval) });
    interval = seconds / 3600;
    if (interval > 1) return t('hoursAgo', { count: Math.floor(interval) });
    interval = seconds / 60;
    if (interval > 1) return t('minutesAgo', { count: Math.floor(interval) });
    return t('justNow');
};

const NotificationWidget: React.FC = () => {
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        if (!isOpen && unreadCount > 0) {
            markAsRead();
        }
        setIsOpen(prev => !prev);
    };

    const handleClearAll = () => {
        clearAll();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label={t('notifications')}
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-lg z-20 border border-gray-200 flex flex-col max-h-[80vh]">
                    <div className="flex justify-between items-center p-3 border-b">
                        <h3 className="font-semibold text-gray-800">{t('notifications')}</h3>
                        {notifications.length > 0 && (
                            <button onClick={handleClearAll} className="text-xs text-blue-600 hover:underline">
                                {t('clearAll')}
                            </button>
                        )}
                    </div>
                    <div className="overflow-y-auto">
                        {notifications.length > 0 ? (
                            <ul>
                                {notifications.map(n => (
                                    <li key={n.id} className={`flex items-start p-3 gap-3 border-b last:border-b-0 hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}>
                                        <div className="flex-shrink-0 mt-1"><NotificationIcon type={n.type}/></div>
                                        <div className="flex-grow">
                                            <p className="text-sm text-gray-700">{n.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatTimestamp(n.timestamp, t)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 px-4">
                                <Bell className="mx-auto text-gray-300" size={40} />
                                <p className="mt-2 text-sm text-gray-500">{t('noNotifications')}</p>
                            </div>
                        )}
                    </div>
                    <div className="p-2 border-t bg-gray-50 text-center">
                        <button className="flex items-center justify-center w-full text-xs text-gray-600 hover:text-blue-600">
                           <Settings size={14} className="mr-1" /> {t('notificationSettings')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationWidget;
