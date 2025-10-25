
import React, { useState, useCallback, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterDetailsPage from './pages/RegisterDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import UserManagementPage from './pages/UserManagementPage';
import RegistrationPage from './pages/RegistrationPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProfileModal from './components/ProfileModal';
import AccessDeniedPage from './components/AccessDeniedPage';
import { Page, Role } from './types';
import { registers } from './services/api';
import ChatWidget from './components/chat/ChatWidget';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
          <Main />
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [activeRegisterId, setActiveRegisterId] = useState<string | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const navigateTo = useCallback((page: Page, registerId?: string) => {
    setCurrentPage(page);
    if (registerId) {
      setActiveRegisterId(registerId);
    } else {
      setActiveRegisterId(null);
    }
  }, []);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const activeRegister = useMemo(() => {
    return registers.find(r => r.id === activeRegisterId) || null;
  }, [activeRegisterId]);

  const modernBackgroundStyle = {
    backgroundColor: '#f9fafb',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e%3crect width='20' height='20' fill='%23f9fafb'/%3e%3cg fill='%23e5e7eb'%3e%3crect width='1' height='1' x='0' y='0'/%3e%3crect width='1' height='1' x='10' y='10'/%3e%3c/g%3e%3c/svg%3e")`
  };

  if (!user) {
    if (currentPage === Page.REGISTER) {
      return <RegistrationPage navigateTo={navigateTo} />;
    }
    return <LoginPage navigateTo={navigateTo} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return user.role === Role.ADMIN ? <AdminDashboard navigateTo={navigateTo}/> : <Dashboard />;
      case Page.REGISTER_DETAILS:
        return activeRegister ? <RegisterDetailsPage register={activeRegister} navigateTo={navigateTo} /> : <div>Register not found</div>;
      case Page.USER_MANAGEMENT:
        return user.role === Role.ADMIN ? <UserManagementPage navigateTo={navigateTo} /> : <AccessDeniedPage navigateTo={navigateTo} />;
      default:
        return user.role === Role.ADMIN ? <AdminDashboard navigateTo={navigateTo} /> : <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen font-sans" style={modernBackgroundStyle}>
      <Sidebar navigateTo={navigateTo} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} setSidebarOpen={setSidebarOpen} onEditProfile={() => setProfileModalOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
        <Footer />
      </div>
       {isProfileModalOpen && user && <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />}
       <ChatWidget />
    </div>
  );
};

export default App;