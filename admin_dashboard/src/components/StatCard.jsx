import React from 'react';

export const StatCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendType = 'neutral',
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center justify-between text-slate-500 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#3C6FDB]">
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
