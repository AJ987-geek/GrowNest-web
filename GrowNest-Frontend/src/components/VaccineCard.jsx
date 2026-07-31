import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { formatDate, getDaysUntil } from '../utils/helpers.js';

export default function VaccineCard({ vaccine, isLast, onLogDose }) {
  let label = 'Upcoming';
  let badgeColor = 'badge-info bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
  let Icon = Calendar;
  let lineColor = 'bg-gray-300';
  let dotColor = 'bg-gray-400';

  if (vaccine.status === 'completed') {
    label = 'Completed';
    badgeColor = 'badge-success';
    Icon = CheckCircle;
    lineColor = 'bg-emerald-400';
    dotColor = 'bg-emerald-500';
  } else {
    // Determine dynamic urgency based on days
    const daysUntil = getDaysUntil(vaccine.date);

    if (daysUntil < -30) {
      label = 'Catch-up needed';
      badgeColor = 'bg-red-900 text-red-100 px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider';
      Icon = AlertCircle;
      lineColor = 'bg-red-800';
      dotColor = 'bg-red-900';
    } else if (daysUntil < 0) {
      label = 'Overdue';
      badgeColor = 'badge-danger px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider';
      Icon = AlertCircle;
      lineColor = 'bg-red-400';
      dotColor = 'bg-red-500';
    } else if (daysUntil <= 14) {
      label = 'Due soon';
      badgeColor = 'bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider dark:bg-amber-900/40 dark:text-amber-400';
      Icon = Clock;
      lineColor = 'bg-amber-400';
      dotColor = 'bg-amber-500';
    } else {
      label = 'Upcoming';
      badgeColor = 'bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider dark:bg-gray-800 dark:text-gray-400';
      Icon = Calendar;
      lineColor = 'bg-gray-300';
      dotColor = 'bg-gray-400';
    }
  }

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className={`absolute left-3.5 top-8 bottom-0 w-0.5 ${lineColor} opacity-30`} />
      )}
      <div className={`relative z-10 w-7 h-7 rounded-full ${dotColor} flex items-center justify-center flex-shrink-0 shadow-md mt-0.5`}>
        <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex-1 card p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{vaccine.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                  {vaccine.status === 'completed' ? `Given: ${formatDate(vaccine.actual_date || vaccine.date)}` : `Due: ${formatDate(vaccine.date)}`}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{vaccine.dueAge}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={badgeColor}>{label}</span>
            {vaccine.status !== 'completed' && onLogDose && (
              <button
                onClick={() => onLogDose(vaccine)}
                className="btn-primary text-xs py-1.5 px-3 mt-1"
              >
                Log Dose
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}