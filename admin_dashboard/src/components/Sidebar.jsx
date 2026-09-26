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
    <aside className="w-64 bg-white text-slate-600 flex flex-col justify-between border-r border-slate-200 flex-shrink-0 select-none shadow-sm z-20">
      {/* Top Workspace Identity */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-[#3C6FDB] flex items-center justify-center text-white">
              <Shield size={16} className="text-white" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-slate-800">GUYNOVA GUARD</span>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-blue-100 text-[#3C6FDB] border border-blue-200">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Operations Console</p>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="px-3 pt-4">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
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
                  className={`relative w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-[#3C6FDB] border border-blue-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {/* Left Blue Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#3C6FDB]" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={16}
                      className={isActive ? 'text-[#3C6FDB]' : 'text-slate-500 group-hover:text-slate-700'}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-[#3C6FDB] border border-blue-200 font-semibold">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight size={13} className="text-[#3C6FDB]" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status & Admin Footer */}
      <div className="p-3 space-y-2 border-t border-slate-200 bg-white">
        {/* Live Cluster Ping */}
        <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-slate-700 font-medium">Cluster Active</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 font-semibold">99.9% Up</span>
        </div>

        {/* User Account Popover */}
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#3C6FDB] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-semibold text-slate-800 truncate">{admin?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-100 rounded-lg"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

