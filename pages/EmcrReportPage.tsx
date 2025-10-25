import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Register, RecordData, FieldType, Page } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PlusCircle, Edit, Search, FileDown, ArrowLeft, Save, X } from 'lucide-react';
import { emcrCrimeHeads } from '../services/emcrData';
import { exportElementToPdf, exportToXlsx } from '../services/exportUtils';

const RecordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  register: Register;
  onSave: (record: RecordData) => void;
  initialData: RecordData | null;
  currentYear: number;
  currentMonth: string;
}> = ({ isOpen, onClose, register, onSave, initialData, currentYear, currentMonth }) => {
    
    const { language, t } = useLanguage();
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            const defaultState = register.fields.reduce((acc, field) => {
                acc[field.id] = '';
                return acc;
            }, {} as Record<string, any>);
            setFormData(defaultState);
        }
    }, [initialData, register]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: The direct cast to RecordData was causing a TypeScript error.
        // Casting through 'unknown' as suggested by the compiler message, since
        // the application logic ensures the object will have the required shape.
        onSave({ ...formData, year: currentYear, month: currentMonth } as unknown as RecordData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{t('editRecord')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {register.fields.filter(f => f.type === FieldType.NUMBER).map(field => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block text-xs font-medium text-gray-700">
                                    {language === 'hi' ? field.label_hi : field.label}
                                </label>
                                <input 
                                    type="number"
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id] || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"><Save size={16} className="mr-2"/>{t('saveRecord')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const EmcrReportPage: React.FC<{ navigateTo: (page: Page) => void; }> = ({ navigateTo }) => {
    const { user } = useAuth();
    const { language, t } = useLanguage();
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState('September');
    const [records, setRecords] = useState<RecordData[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<RecordData | null>(null);
    const [isExportMenuOpen, setExportMenuOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const reportContentRef = useRef<HTMLDivElement>(null);


    const register = useMemo(() => api.registers.find(r => r.id === 'emcr_register')!, []);

    useEffect(() => {
        const fetchRecords = async () => {
            if(user) {
                const data = await api.getRecords(user, 'emcr_register', currentYear, { month: currentMonth });
                setRecords(data);
            }
        };
        fetchRecords();
    }, [currentYear, currentMonth, user]);

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

    const handleSaveRecord = async (record: RecordData) => {
        if (user) {
            await api.updateRecord(user, 'emcr_register', record.id, record);
            const updatedRecords = await api.getRecords(user, 'emcr_register', currentYear, { month: currentMonth });
            setRecords(updatedRecords);
        }
    };

    const recordsMap = useMemo(() => {
        return records.reduce((acc, record) => {
            acc[record.crime_head_id] = record;
            return acc;
        }, {} as { [key: string]: RecordData });
    }, [records]);

    const handleEdit = (crimeHeadId: string) => {
        const record = recordsMap[crimeHeadId];
        const crimeHead = emcrCrimeHeads.find(h => h.id === crimeHeadId);
        if (record) {
            setEditingRecord(record);
        } else {
            // Create a shell record for editing if one doesn't exist
            setEditingRecord({
                id: `rec_emcr_${user?.stationId}_${currentYear}_${currentMonth}_${crimeHeadId}`,
                year: currentYear,
                stationId: user?.stationId || '',
                registerId: 'emcr_register',
                month: currentMonth,
                crime_head_id: crimeHeadId,
                crime_head_name: language === 'hi' ? crimeHead?.name_hi : crimeHead?.name
            });
        }
        setModalOpen(true);
    };

    const handleExport = (format: 'pdf' | 'xlsx') => {
        setExportMenuOpen(false);
        const registerName = language === 'hi' ? register.name_hi : register.name;
        const fileName = `${registerName}_${currentMonth}_${currentYear}`;

        if (format === 'pdf') {
            if (reportContentRef.current) {
                exportElementToPdf(reportContentRef.current, fileName);
            }
        } else { // xlsx
            const headers = [
                'S.N.', 'Sub Code', 'Crime Head',
                ...register.fields.filter(f => f.type === FieldType.NUMBER).map(f => language === 'hi' ? f.label_hi : f.label)
            ];
            const data = emcrCrimeHeads.map(head => {
                const record = recordsMap[head.id];
                const row: { [key: string]: any } = {
                    'S.N.': head.s_n,
                    'Sub Code': head.sub_crime_code,
                    'Crime Head': language === 'hi' ? head.name_hi : head.name,
                };
                register.fields.filter(f => f.type === FieldType.NUMBER).forEach(field => {
                     row[language === 'hi' ? field.label_hi : field.label] = record?.[field.id] || 0;
                });
                return row;
            });
            exportToXlsx(data, fileName);
        }
    };

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const months = register.fields.find(f => f.id === 'month')?.options || [];
    const months_hi = register.fields.find(f => f.id === 'month')?.options_hi || [];

    return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigateTo(Page.DASHBOARD)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={t('backToDashboard')}
            >
                <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 m-0">{language === 'hi' ? register.name_hi : register.name}</h2>
        </div>
      
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
                <div>
                    <label htmlFor="year-select" className="text-sm font-medium text-gray-700 mr-2">{t('year')}</label>
                    <select id="year-select" value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))} className="form-select">
                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="month-select" className="text-sm font-medium text-gray-700 mr-2">{t('month')}</label>
                    <select id="month-select" value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)} className="form-select">
                        {months.map((month, i) => <option key={month} value={month}>{language === 'hi' ? months_hi[i] : month}</option>)}
                    </select>
                </div>
            </div>
             <div className="relative" ref={exportMenuRef}>
                 <button 
                    onClick={() => setExportMenuOpen(prev => !prev)}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                    <FileDown size={16} className="mr-2"/> {t('exportData')}
                </button>
                 {isExportMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                        <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('exportAsPdf')}</button>
                        <button onClick={() => handleExport('xlsx')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('exportAsXlsx')}</button>
                    </div>
                )}
            </div>
        </div>

        <div ref={reportContentRef} className="overflow-x-auto border border-gray-300 rounded-lg p-4 bg-white">
            <table className="min-w-full bg-white text-xs">
                <thead className="bg-gray-100 sticky top-0">
                    <tr>
                        <th rowSpan={2} className="th-style w-10">S.N.</th>
                        <th rowSpan={2} className="th-style w-8">Sub Code</th>
                        <th rowSpan={2} className="th-style w-64 text-left">अपराध शिर्षक</th>
                        <th colSpan={10} className="th-style">पूर्व वर्षों के लम्बित</th>
                        <th colSpan={10} className="th-style">आलोच्य वर्ष में दर्ज एवं उनका निस्‍तारण</th>
                        <th colSpan={6} className="th-style">निस्तारण न्यायालय आलोच्य वर्ष</th>
                        <th colSpan={4} className="th-style">विविध</th>
                        <th rowSpan={2} className="th-style w-16">Actions</th>
                    </tr>
                    <tr>
                        {register.fields.filter(f => f.type === FieldType.NUMBER).map(field => (
                             <th key={field.id} className="th-style font-normal" title={language === 'hi' ? field.label_hi : field.label}>
                                <div className="w-20 break-words">{field.label_hi}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {emcrCrimeHeads.map(head => {
                        const record = recordsMap[head.id];
                        const rowClass = head.is_total ? 'bg-yellow-100 font-bold' : (head.parent_code ? '' : 'bg-blue-50');
                        return (
                        <tr key={head.id} className={`hover:bg-gray-50 ${rowClass}`}>
                            <td className="td-style text-center">{head.s_n}</td>
                            <td className="td-style text-center">{head.sub_crime_code}</td>
                            <td className={`td-style text-left ${head.parent_code ? 'pl-6' : 'font-semibold'}`}>{head.name_hi}</td>
                            {register.fields.filter(f => f.type === FieldType.NUMBER).map(field => (
                                <td key={field.id} className="td-style text-center">{record?.[field.id] || 0}</td>
                            ))}
                             <td className="td-style text-center">
                                <button onClick={() => handleEdit(head.id)} className="text-blue-600 hover:text-blue-900 p-1"><Edit size={14}/></button>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
        <style>{`
            .form-select {
                padding: 0.5rem 2rem 0.5rem 0.75rem;
                border: 1px solid #D1D5DB;
                border-radius: 0.375rem;
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                background-position: right 0.5rem center;
                background-repeat: no-repeat;
                background-size: 1.5em 1.5em;
            }
            .th-style {
                padding: 8px 4px;
                border: 1px solid #e5e7eb;
                text-align: center;
                vertical-align: middle;
            }
            .td-style {
                 padding: 6px 4px;
                 border-right: 1px solid #e5e7eb;
            }
        `}</style>

        {isModalOpen && (
            <RecordModal 
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                register={register}
                onSave={handleSaveRecord}
                initialData={editingRecord}
                currentYear={currentYear}
                currentMonth={currentMonth}
            />
        )}
    </div>
    );
};

export default EmcrReportPage;