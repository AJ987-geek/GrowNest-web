import { useState } from 'react';
import { Dumbbell, BookOpen, Calendar, Plus, Check } from 'lucide-react';
import { activitiesData } from '../data/sampleData.js';
import ActivityCard from '../components/ActivityCard.jsx';
import { useApp } from '../context/AppContext.jsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Activities() {
  const { showToast } = useApp();
  const [tab, setTab] = useState('physical');
  const [planned, setPlanned] = useState({ Mon: ['Cycling'], Wed: ['Reading Together'], Fri: ['Swimming'], Sat: ['Outdoor Play', 'Puzzles'] });

  const handleAdd = (activity) => {
    showToast(`${activity.name} added to weekly planner!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Activities</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Age-appropriate activities to keep your child healthy and engaged
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Weekly Goal', value: '7 activities', color: 'text-primary-600' },
          { label: 'Completed', value: '5 this week', color: 'text-emerald-600' },
          { label: 'Streak', value: '12 days 🔥', color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-2">
        {[
          { key: 'physical', label: 'Physical Activities', icon: Dumbbell },
          { key: 'learning', label: 'Learning Activities', icon: BookOpen },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key
                ? 'gradient-bg text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
              }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Activity grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activitiesData[tab].map(activity => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            type={tab}
            onAdd={() => handleAdd(activity)}
          />
        ))}
      </div>

      {/* Weekly Planner */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-gray-900 dark:text-white">Weekly Activity Planner</h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map(day => (
            <div key={day} className="flex flex-col gap-1.5">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 text-center pb-1 border-b border-gray-100 dark:border-gray-800">{day}</p>
              {(planned[day] || []).map(act => (
                <div key={act} className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg px-1.5 py-1 text-center leading-tight">
                  {act}
                </div>
              ))}
              {!(planned[day] || []).length && (
                <div className="text-xs text-gray-300 dark:text-gray-700 text-center py-2">–</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
