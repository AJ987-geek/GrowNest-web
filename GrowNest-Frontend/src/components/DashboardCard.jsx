import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function DashboardCard({ title, value, subtitle, icon: Icon, gradient, trend, trendValue }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <div className="card-hover p-5 group cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mt-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
