import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, FileDown, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { exportToXlsx, exportTableToPdf } from '../services/exportUtils';

interface PendingCasesData {
  name: string;
  name_hi: string;
  pending: number;
}

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [pendingCasesData, setPendingCasesData] = useState<PendingCasesData[]>([]);
  const [month, setMonth] = useState('september');
  const [year, setYear] = useState(new Date().getFullYear());
  const [isExportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.stationId) {
      const data = api.getPendingCasesByCrimeHead(user.stationId, year, month);
      setPendingCasesData(data);
    }
  }, [month, year, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = (format: 'pdf' | 'xlsx') => {
    setExportMenuOpen(false);
    const fileName = `Pending_Cases_${t(month)}_${year}`;
    const headers = [language === 'hi' ? 'अपराध' : 'Crime Head', language === 'hi' ? 'लंबित' : 'Pending'];
    const data = pendingCasesData.map(item => ({
      'Crime Head': language === 'hi' ? item.name_hi : item.name,
      'Pending': item.pending,
    }));
    const body = pendingCasesData.map(item => [language === 'hi' ? item.name_hi : item.name, item.pending]);

    if (format === 'xlsx') {
        exportToXlsx(data, fileName);
    } else {
        exportTableToPdf(headers, body, fileName, language);
    }
  };

  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('quickActions')}</h3>
        <div className="flex flex-wrap gap-4">
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                <PlusCircle size={18} className="mr-2"/> {t('addRecord')}
            </button>
            <button className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                <Eye size={18} className="mr-2"/> {t('viewReports')}
            </button>
            <div className="relative" ref={exportMenuRef}>
                 <button onClick={() => setExportMenuOpen(prev => !prev)} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    <FileDown size={18} className="mr-2"/> {t('exportData')}
                </button>
                 {isExportMenuOpen && (
                    <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                        <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('exportAsPdf')}</button>
                        <button onClick={() => handleExport('xlsx')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('exportAsXlsx')}</button>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4">
        <div className="flex flex-wrap items-center gap-4">
            <div>
                <label htmlFor="month-select" className="text-sm font-medium text-gray-700 mr-2">{t('month')}:</label>
                <select
                    id="month-select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    {months.map(m => <option key={m} value={m}>{t(m)}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="year-select" className="text-sm font-medium text-gray-700 mr-2">{t('year')}:</label>
                 <select
                    id="year-select"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('pendingCasesByCrimeHead', { month: t(month), year })}</h3>
        {pendingCasesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={pendingCasesData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey={language === 'hi' ? 'name_hi' : 'name'}
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [value, t('pendingCases')]} />
              <Legend formatter={() => t('pendingCases')} />
              <Bar dataKey="pending" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">{t('noPendingCases')}</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;