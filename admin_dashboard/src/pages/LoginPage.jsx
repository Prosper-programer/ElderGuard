import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Terminal, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const LoginPage = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Invalid administrator credentials. Verify access permissions.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSandbox = () => {
    setEmail('admin@elderguard.com');
    setPassword('admin123456');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B1120] text-slate-100 flex flex-col justify-between p-6 overflow-hidden select-none">
      {/* Ambient Glow Background Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#3C6FDB]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#00FBFB]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#3C6FDB] to-[#2A56B0] flex items-center justify-center text-white shadow-primaryGlow">
            <Shield size={16} className="text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00FBFB] shadow-[0_0_6px_#00FBFB]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">ElderGuard Console</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FBFB] shadow-[0_0_6px_#00FBFB] animate-pulse" />
          <span>Security Engine Online</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-sm mx-auto my-auto animate-scale-in">
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3C6FDB]/15 border border-[#3C6FDB]/30 text-[#00FBFB] text-[10px] font-bold font-mono uppercase tracking-wider mb-3">
              <Sparkles size={11} />
              <span>Admin Access</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">System Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter administrator credentials to access platform controls.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-900/80 text-xs text-rose-300 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle size={15} className="text-rose-400 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elderguard.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700/80 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#3C6FDB] focus:ring-2 focus:ring-[#3C6FDB]/25 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700/80 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#3C6FDB] focus:ring-2 focus:ring-[#3C6FDB]/25 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#3C6FDB] to-[#2A56B0] hover:from-[#4B7DE6] hover:to-[#3C6FDB] text-white font-bold text-xs shadow-primaryGlow transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Development Sandbox Seed Helper */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono text-[10px]">Test Sandbox</span>
            <button
              type="button"
              onClick={handleUseSandbox}
              className="text-[#00FBFB] hover:text-[#5A8AE6] font-mono text-[10px] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Terminal size={12} />
              <span>Fill Default Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-[11px] text-slate-500 font-mono">
        ElderGuard Health Platform • Strict Role Segregation & Privacy Protection
      </div>
    </div>
  );
};
