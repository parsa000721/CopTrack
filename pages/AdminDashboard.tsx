
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, FileText, UserCheck, Activity, Users, Database } from 'lucide-react';
import * as api from '../services/api';
import { PoliceStation } from '../types';
import { Page } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminDashboardProps {
  navigateTo: (page: Page) => void;
}

const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const caseStatusData = [
  { name: 'Pending', value: 1250 },
  { name: 'Disposed', value: 3850 },
];
const COLORS = ['#FF8042', '#0088FE'];

const recordsPerRegisterData = [
    { name: 'Crime Register', records: 2100 },
    { name: 'Malkhana', records: 5230 },
    { name: 'Index Register', records: 1500 },
    { name: 'Duty Register', records: 8500 },
    { name: 'Warrant List', records: 800 },
];


const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigateTo }) => {
    const [stations, setStations] = useState<PoliceStation[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        const data = api.getAllStations();
        setStations(data);
    }, []);

    const activeStations = stations.filter(s => s.isActive).length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('totalStations')} value={String(stations.length)} icon={<Building className="text-white"/>} color="bg-blue-500" />
                <StatCard title={t('activeStations')} value={String(activeStations)} icon={<UserCheck className="text-white"/>} color="bg-green-500" />
                <StatCard title={t('totalRecords')} value="17,680" icon={<FileText className="text-white"/>} color="bg-indigo-500" />
                <StatCard title={t('recentActivities')} value="152" icon={<Activity className="text-white"/>} color="bg-yellow-500" />
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    {t('adminActions')}
                </h3>
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => navigateTo(Page.USER_MANAGEMENT)} className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                        <Users size={18} className="mr-2"/> {t('manageUsersStations')}
                    </button>
                    <button className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                        <Database size={18} className="mr-2"/> {t('exportSystemReport')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('recordsPerRegister')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={recordsPerRegisterData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="records" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('systemCaseStatus')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                        <Pie
                            data={caseStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {caseStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('lastSystemActivities')}</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('user')}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('station')}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('action')}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('timestamp')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                           {api.getActivityLogs().map(log => (
                             <tr key={log.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{log.userName}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.stationName}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                             </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
