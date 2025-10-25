
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldAlert } from 'lucide-react';
import { Page } from '../types';

interface AccessDeniedPageProps {
  navigateTo: (page: Page) => void;
}

const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ navigateTo }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white p-8 rounded-lg shadow-md">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('accessDeniedTitle')}</h1>
      <p className="text-gray-600 mb-6">{t('accessDeniedMessage')}</p>
      <button
        onClick={() => navigateTo(Page.DASHBOARD)}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {t('backToDashboard')}
      </button>
    </div>
  );
};

export default AccessDeniedPage;
