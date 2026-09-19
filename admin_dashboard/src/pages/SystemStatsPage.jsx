import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Wifi, WifiOff, Shield, RotateCw, Server, Database } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { StatCard } from '../components/StatCard';

export const SystemStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getSystemStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load system statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalDevices = stats?.devices?.total || 0;
  const connectedDevices = stats?.devices?.connected || 0;
  const disconnectedDevices = stats?.devices?.disconnected || 0;
  const connectivityRate =
    totalDevices > 0 ? Math.round((connectedDevices / totalDevices) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              IoT Telemetry & Fleet Infrastructure
            </h2>
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              Healthy
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Wearable telemetry heartbeat health and aggregate database profile counts.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 transition-colors duration-200"
        >
          <RotateCw size={13} className={isLoading ? 'text-[#3C6FDB]' : ''} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Registered Fleet"
          value={totalDevices}
          subtext="Total paired monitoring bands"
          icon={Cpu}
          trend={`${totalDevices} units`}
          trendType="neutral"
        />
        <StatCard
          label="Active Heartbeats"
          value={connectedDevices}
          subtext={`${connectivityRate}% telemetry signal rate`}
          icon={Wifi}
          trend={`${connectivityRate}%`}
          trendType="positive"
        />
        <StatCard
          label="Disconnected / Idle"
          value={disconnectedDevices}
          subtext="No heartbeat > 15 minutes"
          icon={WifiOff}
          trend={disconnectedDevices > 0 ? `${disconnectedDevices} idle` : '0 idle'}
          trendType={disconnectedDevices > 0 ? 'negative' : 'neutral'}
        />
      </div>

      {/* Deep Dive Infrastructure Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Device Health Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Signal Connectivity Index</h3>
              <p className="text-[11px] text-slate-500">Live heartbeat stream across active bracelets</p>
            </div>
            <span className="font-mono text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
              {connectivityRate}% Operational
            </span>
          </div>

          <div className="space-y-4 pt-1 font-mono">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-sans font-semibold text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Active Telemetry Heartbeats
                </span>
                <span className="text-slate-800 font-bold">{connectedDevices} / {totalDevices}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${connectivityRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-sans font-semibold text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Offline Wearables
                </span>
                <span className="text-slate-800 font-bold">{disconnectedDevices} / {totalDevices}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${100 - connectivityRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-sans">
            <span className="font-bold text-slate-800">Telemetry Cycle: </span>
            Smart wearable monitors record timestamps to MySQL (`iot_devices.last_connection`). Wearables silent for over 15 minutes are automatically flagged as disconnected.
          </div>
        </div>

        {/* Aggregate Database Summary */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Database size={16} className="text-[#3C6FDB]" />
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Aggregate Platform Counts</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              High-level capacity statistics for infrastructure scaling.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-sans font-bold text-slate-900 block text-xs">
                    Registered Senior Profiles
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">Across all active parents</span>
                </div>
                <span className="text-xl font-black text-[#3C6FDB] font-mono">
                  {stats?.elderly_profiles?.total || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-sans font-bold text-slate-900 block text-xs">
                    Parent Subscribers
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">Account administrators</span>
                </div>
                <span className="text-xl font-black text-slate-800 font-mono">
                  {stats?.parents?.total || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-sans">
            <Shield size={14} className="text-[#3C6FDB] flex-shrink-0" />
            <span>Strict data isolation: Patient medical charts and clinical logs remain restricted.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
