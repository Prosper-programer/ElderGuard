import React, { useState } from 'react';
import { useAdminAuth } from './context/AdminAuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ParentsPage } from './pages/ParentsPage';
import { SystemStatsPage } from './pages/SystemStatsPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ShieldCheck } from 'lucide-react';

export function App() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0B1120] text-slate-300">
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3C6FDB] to-[#2A56B0] flex items-center justify-center text-white shadow-primaryGlow mb-3 animate-pulse">
          <ShieldCheck size={20} />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00FBFB] shadow-[0_0_8px_#00FBFB]" />
        </div>
        <p className="text-xs font-mono text-slate-400">Initializing ElderGuard Console...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const getPageInfo = () => {
    switch (currentTab) {
      case 'parents':
        return {
          title: 'Parent Accounts',
          subtitle: 'Manage parent subscriber accounts, activations, and suspensions',
        };
      case 'system':
        return {
          title: 'System & IoT Telemetry',
          subtitle: 'Aggregate device fleet connectivity and capacity metrics',
        };
      case 'dashboard':
      default:
        return {
          title: 'Admin Overview',
          subtitle: 'System indicators and high-level platform status',
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar navigation */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
        <Navbar title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardPage onNavigateToParents={() => setCurrentTab('parents')} />
            )}
            {currentTab === 'parents' && <ParentsPage />}
            {currentTab === 'system' && <SystemStatsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
