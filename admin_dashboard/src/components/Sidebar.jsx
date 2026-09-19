import React from 'react';
import { LayoutDashboard, Users, Activity, LogOut, Shield, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Sidebar = ({ currentTab, onSelectTab }) => {
  const { admin, logout } = useAdminAuth();

  const navigation = [
    {
      id: 'dashboard',
      name: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'parents',
      name: 'Parent Accounts',
      icon: Users,
      badge: null,
    },
    {
      id: 'system',
      name: 'System Infrastructure',
      icon: Activity,
      badge: 'Live',
    },
  ];

  return (
    <aside className="w-64 bg-[#0B1120] text-slate-400 flex flex-col justify-between border-r border-slate-800/80 flex-shrink-0 select-none shadow-xl z-20">
      {/* Top Workspace Identity */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0F172A]/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#3C6FDB] to-[#2A56B0] flex items-center justify-center text-white shadow-primaryGlow">
              <Shield size={16} className="text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00FBFB] shadow-[0_0_6px_#00FBFB]" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-white">ElderGuard</span>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#00FBFB]/15 text-[#00FBFB] border border-[#00FBFB]/30">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Operations Console</p>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="px-3 pt-4">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Platform Management
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3C6FDB]/20 via-[#3C6FDB]/10 to-transparent text-white border border-[#3C6FDB]/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  {/* Left Cyan Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#00FBFB] shadow-[0_0_8px_#00FBFB]" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={16}
                      className={`transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-[#00FBFB]' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00FBFB]/10 text-[#00FBFB] border border-[#00FBFB]/30 font-semibold animate-pulse">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight size={13} className="text-[#00FBFB]/70" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status & Admin Footer */}
      <div className="p-3 space-y-2 border-t border-slate-800/80 bg-[#0B1120]">
        {/* Live Cluster Ping */}
        <div className="px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FBFB] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FBFB] shadow-[0_0_6px_#00FBFB]" />
            </span>
            <span className="text-slate-200 font-medium">Cluster Active</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400 font-semibold">99.9% Up</span>
        </div>

        {/* User Account Popover */}
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3C6FDB] to-[#5A8AE6] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-semibold text-slate-100 truncate">{admin?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all active:scale-90"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
