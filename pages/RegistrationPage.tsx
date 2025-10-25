
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Role, Page } from '../types';
import * as api from '../services/api';
import { UserPlus, ArrowLeft } from 'lucide-react';

interface RegistrationPageProps {
  navigateTo: (page: Page) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    role: Role.USER,
    mobile: '',
    ssoId: '',
    email: '',
    stationId: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();

  const policeStations = api.getAllStations();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatchError'));
      return;
    }
    setLoading(true);
    try {
      const station = policeStations.find(s => s.id === formData.stationId);
      if(!station) {
        setError(t('selectValidStationError'));
        setLoading(false);
        return;
      }

      await register({
        name: formData.name,
        designation: formData.designation,
        role: formData.role,
        mobile: formData.mobile,
        ssoId: formData.ssoId,
        email: formData.email,
        stationName: station.name,
        stationId: station.id,
        password: formData.password,
      });
      setSuccess(t('registrationSuccess'));
      setTimeout(() => navigateTo(Page.LOGIN), 2000);
    } catch (err: any) {
      setError(err.message || t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  const modernBackgroundStyle = {
    backgroundColor: '#f9fafb',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e%3crect width='20' height='20' fill='%23f9fafb'/%3e%3cg fill='%23e5e7eb'%3e%3crect width='1' height='1' x='0' y='0'/%3e%3crect width='1' height='1' x='10' y='10'/%3e%3c/g%3e%3c/svg%3e")`
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={modernBackgroundStyle}>
      <div className="w-full max-w-lg">
        <div className="bg-white shadow-2xl rounded-xl p-8 relative">
          <button 
            onClick={() => navigateTo(Page.LOGIN)}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t('goBackToLogin')}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full mb-3">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t('createAccountTitle')}</h1>
            <p className="text-gray-500 mt-1">{t('createAccountSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Form Fields */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">{t('fullNameLabel')}</label>
              <input id="name" name="name" type="text" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="designation">{t('designationLabel')}</label>
              <input id="designation" name="designation" type="text" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="stationId">{t('policeStationLabel')}</label>
              <select id="stationId" name="stationId" required onChange={handleChange} value={formData.stationId} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t('selectStation')}</option>
                {policeStations.map(station => <option key={station.id} value={station.id}>{station.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="mobile">{t('mobileNumberLabel')}</label>
              <input id="mobile" name="mobile" type="tel" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="ssoId">{t('ssoIdLabel')}</label>
              <input id="ssoId" name="ssoId" type="text" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">{t('emailIdLabel')}</label>
              <input id="email" name="email" type="email" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">{t('passwordLabel')}</label>
              <input id="password" name="password" type="password" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">{t('confirmPasswordLabel')}</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            {error && <p className="md:col-span-2 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {success && <p className="md:col-span-2 text-sm text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
            
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                {loading ? t('registering') : t('registerButton')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <button onClick={() => navigateTo(Page.LOGIN)} className="font-medium text-blue-600 hover:text-blue-500">
                {t('loginHere')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
