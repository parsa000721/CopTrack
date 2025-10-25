import React from 'react';
import { User } from '../../types';
import { UserCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface UserListProps {
  users: User[];
  onlineUserIds: string[];
  unreadCounts: Record<string, number>;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onlineUserIds, unreadCounts, selectedUserId, onSelectUser }) => {
  const { t } = useLanguage();
  return (
    <div className="h-full overflow-y-auto border-r bg-white flex flex-col">
      <h2 className="p-4 text-lg font-semibold border-b text-gray-800 shrink-0">{t('contacts')}</h2>
      <ul className="flex-grow">
        {users.map((user) => (
          <li key={user.id}>
            <button
              onClick={() => onSelectUser(user.id)}
              className={`w-full text-left flex items-center p-3 space-x-3 transition-colors ${selectedUserId === user.id ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
            >
              <div className="relative shrink-0">
                <UserCircle className="w-10 h-10 text-gray-400" />
                {onlineUserIds.includes(user.id) && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.designation}</p>
              </div>
              {unreadCounts[user.id] > 0 && (
                <div className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCounts[user.id]}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
