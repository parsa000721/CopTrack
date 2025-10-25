
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User } from '../types';
import { X, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState<Partial<User>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        designation: user.designation,
        mobile: user.mobile,
        email: user.email,
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('newPasswordsDoNotMatch'));
      setLoading(false);
      return;
    }
    
    try {
      await updateUserProfile(formData, passwordData);
      setSuccess(t('profileUpdateSuccess'));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: ''});
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('profileUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{t('editProfile')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Profile Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">{t('personalInformation')}</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">{t('fullNameLabel')}</label>
                    <input id="name" name="name" type="text" value={formData.name || ''} required onChange={handleFormChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="designation">{t('designationLabel')}</label>
                    <input id="designation" name="designation" type="text" value={formData.designation || ''} required onChange={handleFormChange} className="mt-1 block w-full input-style" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">{t('emailIdLabel')}</label>
                    <input id="email" name="email" type="email" value={formData.email || ''} required onChange={handleFormChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="mobile">{t('mobileNumberLabel')}</label>
                    <input id="mobile" name="mobile" type="tel" value={formData.mobile || ''} required onChange={handleFormChange} className="mt-1 block w-full input-style" />
                </div>
            </div>
            {/* Change Password */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">{t('changePassword')}</h3>
                <p className="text-sm text-gray-500">{t('changePasswordHelp')}</p>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="currentPassword">{t('currentPassword')}</label>
                    <input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">{t('newPassword')}</label>
                    <input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">{t('confirmNewPassword')}</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="mt-1 block w-full input-style" />
                </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
          </div>

          <div className="p-5 bg-gray-50 border-t flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('cancel')}</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
              <Save size={16} className="mr-2" />
              {loading ? t('saving') : t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
      <style>{`.input-style { border-radius: 0.375rem; border: 1px solid #D1D5DB; padding: 0.5rem 0.75rem; width: 100%; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #3B82F6; border-color: #2563EB; }`}</style>
    </div>
  );
};

export default ProfileModal;
