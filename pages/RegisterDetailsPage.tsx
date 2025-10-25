import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Register, RecordData, FieldType, Role, Page, RegisterField } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PlusCircle, Edit, Trash, Search, ChevronDown, ChevronUp, FileDown, ArrowLeft } from 'lucide-react';
import { exportTableToPdf, exportToXlsx } from '../services/exportUtils';

// Define the component outside of RegisterDetailsPage
const RecordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  register: Register;
  onSave: (record: RecordData) => void;
  initialData: RecordData | null;
  currentYear: number;
}> = ({ isOpen, onClose, register, onSave, initialData, currentYear }) => {
    
    const { user } = useAuth();
    const { language, t } = useLanguage();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [dynamicOptionsMap, setDynamicOptionsMap] = useState<Record<string, string[]>>({});
    const [loadingOptions, setLoadingOptions] = useState(false);

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

    useEffect(() => {
        const fetchAllDynamicOptions = async () => {
            if (!user) return;
            const fieldsWithDynamicOptions = register.fields.filter(
                f => f.type === FieldType.SELECT && f.optionsSourceRegisterId && f.optionsSourceDisplayField
            );
            if (fieldsWithDynamicOptions.length === 0) return;

            setLoadingOptions(true);
            const newOptionsMap: Record<string, string[]> = {};

            for (const field of fieldsWithDynamicOptions) {
                if (field.optionsSourceRegisterId && field.optionsSourceDisplayField) {
                     const records = await api.getAllRecordsForRegister(user, field.optionsSourceRegisterId);
                     const options = records
                         .map(r => r[field.optionsSourceDisplayField as string])
                         .filter(Boolean);
                     newOptionsMap[field.id] = [...new Set(options)].sort();
                }
            }
            setDynamicOptionsMap(newOptionsMap);
            setLoadingOptions(false);
        };
        fetchAllDynamicOptions();
    }, [register, user]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, year: currentYear } as RecordData);
        onClose();
    };

    const renderField = (field: RegisterField) => {
        const commonProps = {
            id: field.id,
            name: field.id,
            value: formData[field.id] || '',
            onChange: handleChange,
            required: field.required,
            className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        };

        switch (field.type) {
            case FieldType.TEXTAREA:
                return <textarea {...commonProps} rows={3}></textarea>;
            case FieldType.SELECT:
                if (field.optionsSourceRegisterId) {
                    const dynamicOptions = dynamicOptionsMap[field.id] || [];
                    return (
                        <select {...commonProps} disabled={loadingOptions}>
                            <option value="">{loadingOptions ? "Loading..." : `Select ${language === 'hi' ? field.label_hi : field.label}`}</option>
                            {dynamicOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    );
                }
                const options = language === 'hi' && field.options_hi ? field.options_hi : field.options;
                return (
                    <select {...commonProps}>
                        <option value="">Select {language === 'hi' ? field.label_hi : field.label}</option>
                        {field.options?.map((opt, index) => <option key={opt} value={opt}>{options ? options[index] : opt}</option>)}
                    </select>
                );
            case FieldType.CHECKBOX:
                return (
                    <input
                        type="checkbox"
                        id={field.id}
                        name={field.id}
                        checked={!!formData[field.id]}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                );
            case FieldType.FILE:
                return <input type="file" {...commonProps} value={undefined} />; // File input is uncontrolled
            default:
                return <input type={field.type} {...commonProps} />;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">{initialData ? t('editRecord') : t('addNewRecord')}</h2>
                    <p className="text-sm text-gray-500">{t('forRegister', { registerName: language === 'hi' ? register.name_hi : register.name })}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {register.fields.map(field => (
                            <div key={field.id} className={field.type === FieldType.TEXTAREA ? 'md:col-span-2' : ''}>
                                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                                    {language === 'hi' ? field.label_hi : field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                    <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('saveRecord')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const RegisterDetailsPage: React.FC<{ register: Register, navigateTo: (page: Page) => void; }> = ({ register, navigateTo }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState<RecordData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordData | null>(null);
  const [isExportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      if(user && user.stationId) {
        const data = await api.getRecords(user, register.id, currentYear);
        setRecords(data);
      }
    };
    fetchRecords();
  }, [register.id, currentYear, user]);

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
    if (user && user.stationId) {
        if(record.id) {
            await api.updateRecord(user, register.id, record.id, record);
        } else {
            await api.addRecord(user, register.id, record);
        }
        const updatedRecords = await api.getRecords(user, register.id, currentYear);
        setRecords(updatedRecords);
    }
  };
  
  const handleDeleteRecord = async (recordId: string) => {
    if (user && user.stationId && window.confirm('Are you sure you want to delete this record?')) {
        await api.deleteRecord(user, register.id, recordId);
        const updatedRecords = await api.getRecords(user, register.id, currentYear);
        setRecords(updatedRecords);
    }
  };

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records.filter(record => 
      Object.values(record).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [records, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleExport = (format: 'pdf' | 'xlsx') => {
    setExportMenuOpen(false);
    const registerName = language === 'hi' ? register.name_hi : register.name;
    const fileName = `${registerName}_${currentYear}`;

    const headers = register.fields.map(field => language === 'hi' ? field.label_hi : field.label);
    const body = filteredAndSortedRecords.map(record =>
        register.fields.map(field => String(record[field.id] || ''))
    );
     const dataForXlsx = filteredAndSortedRecords.map(record => {
        const row: { [key: string]: any } = {};
        register.fields.forEach(field => {
            const header = language === 'hi' ? field.label_hi : field.label;
            row[header] = record[field.id] || '';
        });
        return row;
    });

    if (format === 'xlsx') {
        exportToXlsx(dataForXlsx, fileName);
    } else {
        exportTableToPdf(headers, body, fileName, language);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

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
            <select
              id="year-select"
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder={t('searchRecords')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
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
            <button 
                onClick={() => { setEditingRecord(null); setModalOpen(true); }}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
                <PlusCircle size={16} className="mr-2"/> {t('addNewRecord')}
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {register.fields.slice(0, 5).map(field => (
                <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => requestSort(field.id)} className="flex items-center">
                    {language === 'hi' ? field.label_hi : field.label}
                    {sortConfig?.key === field.id ? (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>) : null}
                  </button>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedRecords.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                {register.fields.slice(0, 5).map(field => (
                  <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{String(record[field.id] || '-')}</td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => { setEditingRecord(record); setModalOpen(true); }} className="text-blue-600 hover:text-blue-900"><Edit size={18}/></button>
                    <button onClick={() => handleDeleteRecord(record.id)} className="text-red-600 hover:text-red-900"><Trash size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
             {filteredAndSortedRecords.length === 0 && (
                <tr>
                    <td colSpan={register.fields.slice(0, 5).length + 1} className="text-center py-10 text-gray-500">
                        {t('noRecordsFound', { year: currentYear })}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <RecordModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        register={register}
        onSave={handleSaveRecord}
        initialData={editingRecord}
        currentYear={currentYear}
      />
    </div>
  );
};

export default RegisterDetailsPage;