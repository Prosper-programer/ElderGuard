import React from 'react';
import { Search, RotateCw, ChevronLeft, ChevronRight, X, User, ExternalLink } from 'lucide-react';

export const ParentTable = ({
  parents,
  total,
  page,
  limit,
  totalPages,
  isLoading,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onPageChange,
  onRefresh,
  onViewParent,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden flex flex-col transition-all">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search parent name, email, phone..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#3C6FDB]/20 focus:border-[#3C6FDB] transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Tabs & Refresh */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs shadow-inner">
            {['all', 'active', 'inactive'].map((filter) => {
              const isSelected = statusFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => onStatusFilterChange(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#3C6FDB] text-white shadow-md shadow-[#3C6FDB]/30 scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Reload parent accounts"
            className="p-2 text-slate-500 hover:text-[#3C6FDB] hover:bg-[#3C6FDB]/10 border border-slate-200 rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCw size={15} className={isLoading ? 'animate-spin text-[#3C6FDB]' : ''} />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">Account</th>
              <th className="py-3 px-4 font-bold">Contact Details</th>
              <th className="py-3 px-4 font-bold text-center">Senior Profiles</th>
              <th className="py-3 px-4 font-bold">Registration Date</th>
              <th className="py-3 px-4 font-bold text-center">Status</th>
              <th className="py-3 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2.5 text-xs font-mono">
                    <RotateCw size={16} className="animate-spin text-[#3C6FDB]" />
                    <span>Synchronizing parent subscriber accounts...</span>
                  </div>
                </td>
              </tr>
            ) : parents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-bold text-slate-800">No parent accounts match query</p>
                    <p className="text-xs text-slate-400">
                      Clear filters or try searching with different keywords.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              parents.map((p) => {
                const isActive = p.status === 'active';
                return (
                  <tr
                    key={p.user_id}
                    className="hover:bg-slate-50/80 transition-colors duration-150 group cursor-pointer"
                    onClick={() => onViewParent(p)}
                  >
                    {/* User Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3C6FDB]/10 to-[#3C6FDB]/25 text-[#3C6FDB] font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#3C6FDB] group-hover:text-white transition-all duration-200 shadow-sm">
                          {p.full_name?.charAt(0) || 'P'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate text-xs group-hover:text-[#3C6FDB] transition-colors">
                            {p.full_name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">ID: #{p.user_id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs text-slate-800 truncate max-w-[200px] font-medium">
                        {p.email}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {p.phone_number || '—'}
                      </div>
                    </td>

                    {/* Seniors count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-xs font-bold bg-blue-50/70 border border-blue-100 text-[#3C6FDB]">
                        {p.elderly_count || 0}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-mono">
                      {new Date(p.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-[#22C55E] animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        {p.status}
                      </span>
                    </td>

                    {/* Quick Row Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onViewParent(p)}
                          title="Inspect parent profile"
                          className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-subtle transition-all active:scale-95"
                        >
                          View
                        </button>

                        <button
                          onClick={() => onToggleStatus(p)}
                          title={isActive ? 'Deactivate session' : 'Activate account'}
                          className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all active:scale-95 shadow-subtle ${
                            isActive
                              ? 'border-rose-200 bg-rose-50 text-[#EF4444] hover:bg-rose-100'
                              : 'border-emerald-200 bg-emerald-50 text-[#22C55E] hover:bg-emerald-100'
                          }`}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="text-xs">
          Showing <span className="font-bold text-slate-800">{total > 0 ? (page - 1) * limit + 1 : 0}</span>–
          <span className="font-bold text-slate-800">{Math.min(page * limit, total)}</span> of{' '}
          <span className="font-bold text-slate-800">{total}</span> parent accounts
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90 text-slate-700 shadow-subtle"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="px-2 text-xs font-bold text-slate-800">
            {page} / {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90 text-slate-700 shadow-subtle"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
