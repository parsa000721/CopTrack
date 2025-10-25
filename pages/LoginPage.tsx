
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Page } from '../types';
import { ShieldCheck, LogIn } from 'lucide-react';

interface LoginPageProps {
  navigateTo: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigateTo }) => {
  const [ssoIdOrEmail, setSsoIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(ssoIdOrEmail, password);
      if (!user) {
        setError(t('invalidCredentialsError'));
      }
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
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full mb-3">
                <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t('loginTitle')}</h1>
            <p className="text-gray-500 mt-1">{t('loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="ssoIdOrEmail">
                {t('ssoIdOrEmailLabel')}
              </label>
              <input
                id="ssoIdOrEmail"
                type="text"
                value={ssoIdOrEmail}
                onChange={(e) => setSsoIdOrEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                {t('passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? t('loggingIn') : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  {t('loginButton')}
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('dontHaveAccount')}{' '}
              <button
                onClick={() => navigateTo(Page.REGISTER)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('registerHere')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
