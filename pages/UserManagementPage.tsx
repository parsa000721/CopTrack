
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { User, PoliceStation, Page } from '../types';
import { ToggleLeft, ToggleRight, Search, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const UserManagementPage: React.FC<{navigateTo: (page: Page) => void}> = ({ navigateTo }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [stations, setStations] = useState<PoliceStation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useLanguage();

    useEffect(() => {
        setUsers(api.getAllUsers());
        setStations(api.getAllStations());
    }, []);

    const handleToggleStationStatus = async (stationId: string, isActive: boolean) => {
        await api.updateStationStatus(stationId, isActive);
        setStations(api.getAllStations());
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.stationName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="mb-[-1rem]">
                <button 
                    onClick={() => navigateTo(Page.DASHBOARD)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium"
                    aria-label={t('backToDashboard')}
                >
                    <ArrowLeft size={16} className="mr-1" />
                    {t('backToDashboard')}
                </button>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('stationManagement')}</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('stationName')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stations.map(station => (
                                    <tr key={station.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{station.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${station.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {station.isActive ? t('active') : t('inactive')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => handleToggleStationStatus(station.id, !station.isActive)} className="flex items-center">
                                                {station.isActive ? <ToggleRight size={24} className="text-green-500"/> : <ToggleLeft size={24} className="text-gray-400"/>}
                                                <span className="ml-2 text-gray-600">{station.isActive ? t('deactivate') : t('activate')}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('userManagement')}</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                              type="text"
                              placeholder={t('searchUsersPlaceholder')}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-2 w-full md:w-1/3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('name')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('station')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('role')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('email')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('ssoId')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.stationName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.ssoId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage;
