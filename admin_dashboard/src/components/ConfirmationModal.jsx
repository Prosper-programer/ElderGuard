import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  action,
  parent,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !parent) return null;

  const isDeactivating = action === 'deactivate';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={!isLoading ? onClose : undefined}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Dialog box */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-10">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDeactivating
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : 'bg-green-50 text-green-600 border border-green-100'
              }`}
            >
              {isDeactivating ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {isDeactivating ? 'Deactivate parent account?' : 'Activate parent account?'}
              </h3>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Are you sure you want to {isDeactivating ? 'deactivate' : 'activate'}{' '}
                <span className="font-bold text-slate-900">{parent.full_name}</span> (
                <span className="font-mono text-slate-600">{parent.email}</span>)?
              </p>

              {isDeactivating ? (
                <div className="mt-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-800 leading-normal">
                  <span className="font-bold">Immediate Session Invalidation: </span>
                  All active login tokens for this parent will be immediately rejected with HTTP 403 on their mobile app.
                </div>
              ) : (
                <div className="mt-3.5 p-3 rounded-xl bg-green-50 border border-green-200 text-[11px] text-green-800 leading-normal">
                  <span className="font-bold">Access Restored: </span>
                  The parent user will regain access to log in, view senior profiles, and coordinate with their care team.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors duration-200 disabled:opacity-50 bg-white border border-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition-colors duration-200 flex items-center gap-1.5 ${
              isDeactivating
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } disabled:opacity-50`}
          >
            {isLoading
              ? 'Applying...'
              : isDeactivating
              ? 'Confirm Deactivation'
              : 'Confirm Activation'}
          </button>
        </div>
      </div>
    </div>
  );
};
