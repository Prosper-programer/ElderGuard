import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, HeartHandshake, Cpu, RotateCw, ArrowRight, ShieldCheck, Activity, Sparkles } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { StatCard } from '../components/StatCard';

export const DashboardPage = ({ onNavigateToParents }) => {
  const [stats, setStats] = useState(null);
  const [recentParents, setRecentParents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, parentsData] = await Promise.all([
        adminApi.getSystemStats(),
        adminApi.getParents({ page: 1, limit: 6 }),
      ]);
      setStats(statsData);
      setRecentParents(parentsData.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalParents = stats?.parents?.total || 0;
  const activeParents = stats?.parents?.active || 0;
  const inactiveParents = stats?.parents?.inactive || 0;
  const activePct = totalParents > 0 ? Math.round((activeParents / totalParents) * 100) : 100;

  const totalDevices = stats?.devices?.total || 0;
  const connectedDevices = stats?.devices?.connected || 0;
  const disconnectedDevices = stats?.devices?.disconnected || 0;
  const deviceOnlinePct = totalDevices > 0 ? Math.round((connectedDevices / totalDevices) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Platform Overview & Telemetry</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#3C6FDB] border border-blue-200 font-mono text-[10px] font-bold">
              GUYNOVA GUARD Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational status of subscriber parent accounts and paired monitoring beacons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 transition-colors duration-200"
          >
            <RotateCw size={13} className={isLoading ? 'text-[#3C6FDB]' : ''} />
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Parent Subscribers"
          value={totalParents}
          subtext={`${activeParents} accounts operational`}
          icon={Users}
          trend={`${activePct}% Active`}
          trendType="positive"
        />
        <StatCard
          label="Active Sessions"
          value={activeParents}
          subtext="Verified access grants"
          icon={UserCheck}
          trend="Healthy"
          trendType="positive"
        />
        <StatCard
          label="Suspended Accounts"
          value={inactiveParents}
          subtext="Tokens blocked on server"
          icon={UserX}
          trend={inactiveParents > 0 ? `${inactiveParents} blocked` : '0 blocked'}
          trendType={inactiveParents > 0 ? 'negative' : 'neutral'}
        />
        <StatCard
          label="Elderly Profiles"
          value={stats?.elderly_profiles?.total || 0}
          subtext="Total registered seniors"
          icon={HeartHandshake}
          trend="Aggregate"
          trendType="neutral"
        />
      </div>

      {/* Two-Column Operational Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Parent Account Health Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">Parent Account Distribution</h3>
                <p className="text-[11px] text-slate-500">Active subscribers vs. suspended credentials</p>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                {activePct}% Active
              </span>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-700 font-sans font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Active Subscribers
                  </span>
                  <span className="text-slate-800 font-bold">{activeParents} / {totalParents}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${activePct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-700 font-sans font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Inactive / Suspended
                  </span>
                  <span className="text-slate-800 font-bold">{inactiveParents} / {totalParents}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${100 - activePct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Session Invalidation: Enabled</span>
            <span className="text-green-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              HTTP 403 On Deactivate
            </span>
          </div>
        </div>

        {/* IoT Fleet Telemetry Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">IoT Beacon Fleet</h3>
                <p className="text-[11px] text-slate-500">Live telemetry heartbeat stream across devices</p>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3C6FDB] border border-blue-200">
                {deviceOnlinePct}% Online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1">
                  Online Beacons
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {connectedDevices}
                </span>
                <span className="text-[11px] text-green-600 font-bold ml-1.5">● live</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1">
                  Disconnected
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {disconnectedDevices}
                </span>
                <span className="text-[11px] text-slate-400 font-medium ml-1.5">idle</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Interval: 15s Heartbeat</span>
            <span className="text-[#3C6FDB] font-semibold">Zero Patient Telemetry Leakage</span>
          </div>
        </div>
      </div>

      {/* Recent Parents Ledger Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">Recent Parent Registrations</h3>
            <p className="text-[11px] text-slate-500">Newly joined parent subscribers</p>
          </div>
          <button
            onClick={onNavigateToParents}
            className="text-xs font-bold text-[#3C6FDB] hover:text-blue-800 flex items-center gap-1"
          >
            <span>View Full Directory</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4 font-bold">Account</th>
                <th className="py-2.5 px-4 font-bold">Email</th>
                <th className="py-2.5 px-4 font-bold text-center">Senior Profiles</th>
                <th className="py-2.5 px-4 font-bold">Joined</th>
                <th className="py-2.5 px-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentParents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No parent subscribers registered yet.
                  </td>
                </tr>
              ) : (
                recentParents.map((p) => {
                  const isActive = p.status === 'active';
                  return (
                    <tr
                      key={p.user_id}
                      onClick={onNavigateToParents}
                      className="hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {p.full_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 text-xs">{p.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3C6FDB] border border-blue-100">
                          {p.elderly_count || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-xs">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
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
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

