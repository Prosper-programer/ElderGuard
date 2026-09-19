import React from 'react';
import { Shield, Command, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Navbar = ({ title, subtitle }) => {
  const { admin } = useAdminAuth();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 flex items-center justify-between flex-shrink-0 z-10 shadow-subtle transition-all">
      {/* Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span className="hover:text-slate-600 transition-colors cursor-default">ElderGuard</span>
          <span>/</span>
          <span className="text-[#3C6FDB] font-semibold">{title}</span>
        </div>
        <h1 className="text-sm font-bold text-slate-900 tracking-tight mt-0.5">{title}</h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Search trigger indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs shadow-inner hover:border-slate-300 transition-all cursor-pointer">
          <span className="text-[11px]">Search console...</span>
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-mono text-slate-600 font-bold shadow-subtle">
            <Command size={10} /> K
          </span>
        </div>

        {/* Environment Tag with ElderGuard Cyan Pulse */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium font-mono shadow-subtle">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3C6FDB] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3C6FDB]" />
          </span>
          <span className="font-semibold text-slate-800">Production</span>
        </div>

        {/* Admin Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3C6FDB] to-[#5A8AE6] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 transition-transform">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block leading-tight">
            <p className="text-xs font-bold text-slate-800">{admin?.name || 'Administrator'}</p>
            <p className="text-[10px] text-[#3C6FDB] font-semibold font-mono">Platform Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
