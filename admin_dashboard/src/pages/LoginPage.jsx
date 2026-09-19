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
    <div className="relative min-h-screen w-full bg-[#F8FAFC] text-slate-800 flex flex-col justify-between p-6 select-none">
      
      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-sm mx-auto my-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#3C6FDB] text-[10px] font-bold font-mono uppercase tracking-wider mb-3">
              <Shield size={11} />
              <span>Admin Access</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">System Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter administrator credentials to access platform controls.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2.5">
              <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elderguard.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3C6FDB] focus:ring-1 focus:ring-[#3C6FDB] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3C6FDB] focus:ring-1 focus:ring-[#3C6FDB] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#3C6FDB] hover:bg-[#2A56B0] text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[10px]">Test Sandbox</span>
            <button
              type="button"
              onClick={handleUseSandbox}
              className="text-[#3C6FDB] hover:text-[#2A56B0] font-mono text-[10px] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Terminal size={12} />
              <span>Fill Default Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-[11px] text-slate-400 font-mono">
        ElderGuard Health Platform • Strict Role Segregation & Privacy Protection
      </div>
    </div>
  );
};
