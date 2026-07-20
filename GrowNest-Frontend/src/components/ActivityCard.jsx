import { Clock, Zap, Target } from 'lucide-react';

const intensityColors = {
  Low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  Medium: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
  High: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
};

export default function ActivityCard({ activity, type = 'physical', onAdd }) {
  return (
    <div className="card-hover p-4 group cursor-pointer" onClick={onAdd}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{activity.icon}</div>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
          {activity.ageRange} yrs
        </span>
      </div>

      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{activity.name}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{activity.description}</p>

      {type === 'physical' ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {activity.duration}
          </div>
          <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${intensityColors[activity.intensity]}`}>
            <Zap className="w-3 h-3" />
            {activity.intensity}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
            <Target className="w-3.5 h-3.5" />
            ~{activity.calories} cal
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {activity.duration}
          </div>
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-full ml-auto">
            {activity.benefit}
          </span>
        </div>
      )}
    </div>
  );
}
