
import React, { Fragment } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Page, Role } from '../../types';
import { registers } from '../../services/api';
import { LayoutDashboard, Users, Folder, X, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  navigateTo: (page: Page, registerId?: string) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navigateTo, isOpen, setOpen }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const handleNavigate = (page: Page, registerId?: string) => {
    navigateTo(page, registerId);
    setOpen(false);
  };

  const adminNavItems = [
    { icon: <LayoutDashboard size={20} />, label: t('adminDashboard'), page: Page.DASHBOARD, action: () => handleNavigate(Page.DASHBOARD) },
    { icon: <Users size={20} />, label: t('userManagement'), page: Page.USER_MANAGEMENT, action: () => handleNavigate(Page.USER_MANAGEMENT) },
  ];

  const userNavItems = [
     { icon: <LayoutDashboard size={20} />, label: t('dashboard'), page: Page.DASHBOARD, action: () => handleNavigate(Page.DASHBOARD) },
  ];
  
  const navItems = user?.role === Role.ADMIN ? adminNavItems : userNavItems;


  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
            <ShieldCheck className="text-white h-8 w-8"/>
            <span className="text-xl font-bold text-white">{t('policeRMS')}</span>
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center px-4 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </button>
        ))}
        {user?.role !== Role.ADMIN && (
          <>
            <div className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('registers')}</div>
            {registers.map((register) => (
              <button
                key={register.id}
                onClick={() => handleNavigate(Page.REGISTER_DETAILS, register.id)}
                className="w-full flex items-center px-4 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 text-left"
              >
                <Folder size={20} className="flex-shrink-0" />
                <span className="ml-3">{language === 'hi' ? register.name_hi : register.name}</span>
              </button>
            ))}
          </>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setOpen(false)}></div>
          <div className={`relative flex z-10 w-64 h-full bg-gray-800 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              {sidebarContent}
          </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
        <div className="flex flex-col w-64 h-full bg-gray-800">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;