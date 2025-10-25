import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white text-xs p-3 text-center">
      <h4 className="font-bold mb-1 text-sm">{t('footerWarningTitle')}</h4>
      <div className="space-y-1 text-yellow-300">
        <p>{t('footerWarningLine1')}</p>
        <p>{t('footerWarningLine2')}</p>
      </div>
    </footer>
  );
};

export default Footer;