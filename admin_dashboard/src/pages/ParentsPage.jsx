import React, { useState, useEffect, useCallback } from 'react';
import { Users, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { ParentTable } from '../components/ParentTable';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ParentDetailModal } from '../components/ParentDetailModal';

export const ParentsPage = () => {
  const [parents, setParents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [selectedParentForDetail, setSelectedParentForDetail] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: 'activate',
    parent: null,
    isLoading: false,
  });

  // Notification Toast
  const [toast, setToast] = useState(null);

  const fetchParents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getParents({
        search: searchQuery.trim(),
        status: statusFilter,
        page,
        limit,
      });
      setParents(response.data || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch parent accounts:', err);
      setToast({
        type: 'error',
        message: 'Could not synchronize accounts from server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, page, limit]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleOpenConfirm = (parent) => {
    const action = parent.status === 'active' ? 'deactivate' : 'activate';
    setConfirmModal({
      isOpen: true,
      action,
      parent,
      isLoading: false,
    });
  };

  const handleConfirmAction = async () => {
    const { action, parent } = confirmModal;
    if (!parent) return;

    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
    try {
      if (action === 'activate') {
        await adminApi.activateParent(parent.user_id);
        setToast({
          type: 'success',
          message: `Account for ${parent.full_name} is now active.`,
        });
      } else {
        await adminApi.deactivateParent(parent.user_id);
        setToast({
          type: 'success',
          message: `Account for ${parent.full_name} suspended. Sessions revoked.`,
        });
      }
      setConfirmModal({ isOpen: false, action: 'activate', parent: null, isLoading: false });
      fetchParents();
    } catch (err) {
      console.error('Action failed:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.message || `Failed to ${action} account.`,
      });
      setConfirmModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Parent Subscriber Accounts</span>
            </h2>
            <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3C6FDB] border border-blue-200 font-bold">
              {total} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage guardian credentials, monitor profile counts, and enforce access status.
          </p>
        </div>
      </div>

      {/* Floating Toast Notification with ElderGuard Accent */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div
            className={`px-4 py-3 rounded-2xl shadow-modal border text-xs flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-[#0B1120]/95 text-white border-slate-700 shadow-primaryGlow'
                : 'bg-rose-950/95 text-rose-100 border-rose-900 shadow-lg'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={16} className="text-[#00FBFB] flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-[#EF4444] flex-shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-200 ml-2"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <ParentTable
        parents={parents}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        isLoading={isLoading}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onPageChange={setPage}
        onRefresh={fetchParents}
        onViewParent={(parent) => setSelectedParentForDetail(parent)}
        onToggleStatus={handleOpenConfirm}
      />

      {/* Slide-over Inspection Sheet */}
      <ParentDetailModal
        isOpen={!!selectedParentForDetail}
        parent={selectedParentForDetail}
        onClose={() => setSelectedParentForDetail(null)}
        onToggleStatus={handleOpenConfirm}
      />

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        action={confirmModal.action}
        parent={confirmModal.parent}
        isLoading={confirmModal.isLoading}
        onClose={() =>
          setConfirmModal({ isOpen: false, action: 'activate', parent: null, isLoading: false })
        }
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};
