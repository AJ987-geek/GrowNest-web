import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { formatDate, getDaysUntil } from '../utils/helpers.js';

const statusConfig = {
  completed: {
    icon: CheckCircle,
    badge: 'badge-success',
    label: 'Completed',
    lineColor: 'bg-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  upcoming: {
    icon: Clock,
    badge: 'badge-info',
    label: 'Upcoming',
    lineColor: 'bg-blue-400',
    dotColor: 'bg-blue-500',
  },
  missed: {
    icon: AlertCircle,
    badge: 'badge-danger',
    label: 'Missed',
    lineColor: 'bg-red-400',
    dotColor: 'bg-red-500',
  },
};

export default function VaccineCard({ vaccine, isLast, onMarkComplete }) {
  const config = statusConfig[vaccine.status];
  const Icon = config.icon;
  const daysUntil = vaccine.status === 'upcoming' ? getDaysUntil(vaccine.date) : null;

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className={`absolute left-3.5 top-8 bottom-0 w-0.5 ${config.lineColor} opacity-30`} />
      )}
      <div className={`relative z-10 w-7 h-7 rounded-full ${config.dotColor} flex items-center justify-center flex-shrink-0 shadow-md mt-0.5`}>
        <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex-1 card p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{vaccine.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(vaccine.date)}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{vaccine.dueAge}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={config.badge}>{config.label}</span>
            {vaccine.status !== 'completed' && onMarkComplete && (
              <button
                onClick={() => onMarkComplete(vaccine.id)}
                className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline mt-1 cursor-pointer"
              >
                Mark Completed ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}