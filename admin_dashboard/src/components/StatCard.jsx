import React from 'react';

export const StatCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  highlightColor = '#3C6FDB',
}) => {
  return (
    <div className="group relative p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-[#3C6FDB]/50 hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent Line on Hover */}
      <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3C6FDB] via-[#00FBFB] to-[#3C6FDB] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between text-slate-500 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-[#3C6FDB] group-hover:bg-[#3C6FDB]/10 group-hover:scale-110 group-hover:text-[#3C6FDB] transition-all duration-200">
            <Icon size={16} strokeWidth={2} />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-black text-slate-900 tracking-tight font-sans">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        {(subtext || trend) && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            {trend && (
              <span
                className={`font-bold font-mono text-[11px] px-2 py-0.5 rounded-full ${
                  trendType === 'positive'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : trendType === 'negative'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {trend}
              </span>
            )}
            {subtext && <span className="text-slate-500 text-[11px] font-medium">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
