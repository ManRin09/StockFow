import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  hoverEffect = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-200' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          <div>
            {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  colorScheme = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue'
}) => {
  const schemeStyles = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      accent: 'border-l-indigo-500',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      accent: 'border-l-emerald-500',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      accent: 'border-l-amber-500',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      accent: 'border-l-rose-500',
    },
    blue: {
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
      accent: 'border-l-sky-500',
    },
  };

  const scheme = schemeStyles[colorScheme] || schemeStyles.indigo;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <h4 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold flex items-center gap-1 ${
                trend > 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend > 0 ? '+' : ''}
              {trend}% {trendLabel && <span className="text-slate-400 font-normal">{trendLabel}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
