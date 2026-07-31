
import { useState, useEffect } from 'react';
import { Dumbbell, BookOpen, Calendar, Plus, Check } from 'lucide-react';
import { activitiesData } from '../data/sampleData.js';
import ActivityCard from '../components/ActivityCard.jsx';
import { useApp } from '../context/AppContext.jsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Activities() {
  const { showToast, child } = useApp();
  const [tab, setTab] = useState('physical');
  const [activities, setActivities] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');

  const fetchActivities = async () => {
    if (!child) return;
    try {
      const res = await fetch(`http://localhost:5000/api/children/${child.id}/activities`);
      if (res.ok) setActivities(await res.json());
    } catch (e) { console.error(e); }
  };
  const handleDelete = async (activityId) => {
    if (!window.confirm("Remove this activity?")) return;
    try {
      await fetch(`http://localhost:5000/api/children/${child.id}/activities/${activityId}`, { method: 'DELETE' });
      fetchActivities(); // Refresh the timeline!
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchActivities();
  }, [child]);

  const handleAdd = async (activity) => {
    if (!child) return;
    try {
      const res = await fetch(`http://localhost:5000/api/children/${child.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_name: activity.name, category: tab })
      });
      if (res.ok) {
        showToast(`"${activity.name}" logged for today!`, 'success');
        fetchActivities();
      }
    } catch (e) { console.error(e); }
  };

  const groupedActivities = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
  activities.forEach(act => {
    if (!act.log_date) return;
    // Let the browser convert the backend UTC timestamp to the user's local timezone
    const d = new Date(act.log_date);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (groupedActivities[dayName]) {
      groupedActivities[dayName].push(act);
    }
  });

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
          { label: 'Weekly Goal', value: '8 activities', color: 'text-primary-600' },
          { label: 'Completed', value: `${activities.length} this week`, color: 'text-emerald-600' },
          { label: 'Streak', value: activities.length > 0 ? 'Active 🔥' : 'None yet', color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex justify-between items-center">
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
        <button onClick={() => setShowCustomModal(true)} className="btn-primary text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Custom Activity
        </button>
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
          <h2 className="font-bold text-gray-900 dark:text-white">Completed Activities (Last 7 Days)</h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map(day => (
            <div key={day} className="flex flex-col gap-1.5">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 text-center pb-1 border-b border-gray-100 dark:border-gray-800">{day}</p>
              {(groupedActivities[day] || []).map((act, i) => (
                <div key={i} className="group relative text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg px-1.5 py-1 text-center leading-tight pr-6">
                  {act.activity_name}
                  {/* The secret Delete Button that appears on hover! */}
                  <button onClick={() => handleDelete(act.id)} className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-lg leading-none">
                    &times;
                  </button>
                </div>
              ))}
              {!(groupedActivities[day] || []).length && (
                <div className="text-xs text-gray-300 dark:text-gray-700 text-center py-2">–</div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Custom Activity Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Log Custom Activity</h3>
              <button onClick={() => setShowCustomModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold leading-none">
                &times;
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAdd({ name: customName }); setShowCustomModal(false); setCustomName(''); }} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Activity Name</label>
                <input required type="text" value={customName} onChange={e => setCustomName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. Karate Class" />
              </div>
              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl py-3 shadow-md transition-all">Log for Today</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
