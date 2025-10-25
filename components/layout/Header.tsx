
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { User } from '../../types';
import { LogOut, Menu, UserCircle, ChevronDown, Edit } from 'lucide-react';
import NotificationWidget from '../notifications/NotificationWidget';

interface HeaderProps {
  user: User;
  setSidebarOpen: (open: boolean) => void;
  onEditProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, setSidebarOpen, onEditProfile }) => {
  const { logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-gray-500 focus:outline-none lg:hidden"
      >
        <Menu size={24} />
      </button>
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">{t('systemTitle')}</h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <NotificationWidget />
        <div className="flex items-center border border-gray-300 rounded-md">
            <button 
                onClick={() => setLanguage('en')} 
                className={`px-3 py-1 text-sm rounded-l-md transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
                EN
            </button>
            <button 
                onClick={() => setLanguage('hi')} 
                className={`px-3 py-1 text-sm rounded-r-md transition-colors ${language === 'hi' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
                HI
            </button>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none">
            <UserCircle className="text-gray-600" />
            <div className="text-right">
              <p className="font-semibold text-sm text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.stationName || t('adminPanel')}</p>
            </div>
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <button
                onClick={() => {
                  onEditProfile();
                  setDropdownOpen(false);
                }}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit size={16} className="mr-2" />
                {t('editProfile')}
              </button>
              <div className="border-t my-1 border-gray-100"></div>
              <button
                onClick={logout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                <LogOut size={16} className="mr-2" />
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;