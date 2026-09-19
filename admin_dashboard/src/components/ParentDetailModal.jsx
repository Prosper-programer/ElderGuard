import React, { useEffect } from 'react';
import { X, Mail, Phone, Calendar, Users, Shield, Ban, CheckCircle, ExternalLink } from 'lucide-react';

export const ParentDetailModal = ({
  isOpen,
  parent,
  onClose,
  onToggleStatus,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !parent) return null;

  const isActive = parent.status === 'active';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200"
      />

      <div className="relative w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#3C6FDB] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {parent.full_name?.charAt(0) || 'P'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {parent.full_name}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    isActive
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-green-500' : 'bg-slate-400'
                    }`}
                  />
                  {parent.status}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">Account ID: #{parent.user_id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors duration-200"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Core Metrics */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <span className="text-[11px] font-mono font-semibold text-[#3C6FDB] block mb-1">
                Elderly Profiles
              </span>
              <span className="text-2xl font-black text-slate-900 font-sans">
                {parent.elderly_count || 0}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Under management</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-mono font-semibold text-slate-500 block mb-1">
                Access Level
              </span>
              <span className="text-sm font-bold text-slate-800 font-mono block mt-1">
                Primary Parent
              </span>
              <span className="text-[10px] text-green-600 font-medium block mt-0.5">Verified</span>
            </div>
          </div>

          {/* Spec Information List */}
          <div>
            <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-3">
              Subscriber Information
            </h4>
            <div className="divide-y divide-slate-100 border-t border-b border-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail size={14} className="text-[#3C6FDB]" />
                  Email
                </span>
                <span className="font-mono text-slate-800 font-semibold select-all">
                  {parent.email}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Phone size={14} className="text-[#3C6FDB]" />
                  Phone
                </span>
                <span className="font-mono text-slate-800 font-semibold">
                  {parent.phone_number || '—'}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar size={14} className="text-[#3C6FDB]" />
                  Registered On
                </span>
                <span className="text-slate-800 font-semibold font-mono">
                  {new Date(parent.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Users size={14} className="text-[#3C6FDB]" />
                  Linked Seniors
                </span>
                <span className="text-slate-800 font-semibold">
                  {parent.elderly_count === 1
                    ? '1 Profile'
                    : `${parent.elderly_count || 0} Profiles`}
                </span>
              </div>
            </div>
          </div>

          {/* Architectural Data Minimization Note */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-3">
            <Shield size={18} className="text-[#3C6FDB] mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-[#3C6FDB]">Privacy Protection Active: </span>
              Medical history, clinical notes, prescriptions, and GPS tracking coordinates are strictly restricted from the Admin portal.
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 transition-colors duration-200"
          >
            Done
          </button>

          <button
            onClick={() => {
              onClose();
              onToggleStatus(parent);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 flex items-center gap-1.5 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? (
              <>
                <Ban size={14} />
                <span>Deactivate Account</span>
              </>
            ) : (
              <>
                <CheckCircle size={14} />
                <span>Activate Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
