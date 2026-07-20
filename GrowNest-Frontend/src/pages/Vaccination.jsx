import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Clock, AlertCircle, Bell, Download, Calendar } from 'lucide-react';
import VaccineCard from '../components/VaccineCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Vaccination() {
  const { child, showToast } = useApp();
  const [vaccineData, setVaccineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!child) return;

    const fetchVaccines = async () => {
      try {
        const response = await fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}/vaccinations`);
        if (response.ok) {
          const data = await response.json();
          // Map MySQL column to UI prop
          const mappedData = data.map(v => ({
            ...v,
            dueAge: v.due_age
          }));
          setVaccineData(mappedData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVaccines();
  }, [child]);

  const handleMarkComplete = async (id) => {
    try {
      const response = await fetch(`https://grownest-backend-5xa2.onrender.com/api/vaccinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      if (response.ok) {
        showToast('Vaccine marked as completed!', 'success');
        setVaccineData(prev => prev.map(v => v.id === id ? { ...v, status: 'completed' } : v));
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating vaccine', 'error');
    }
  };

  const completed = vaccineData.filter(v => v.status === 'completed');
  const upcoming = vaccineData.filter(v => v.status === 'upcoming');
  const missed = vaccineData.filter(v => v.status === 'missed');

  const filtered = filter === 'all' ? vaccineData : vaccineData.filter(v => v.status === filter);

  const groupedVaccines = filtered.reduce((groups, vaccine) => {
    const ageGroup = vaccine.dueAge || 'Other';
    if (!groups[ageGroup]) groups[ageGroup] = [];
    groups[ageGroup].push(vaccine);
    return groups;
  }, {});

  const tabs = [
    { key: 'all', label: 'All', count: vaccineData.length, icon: Shield },
    { key: 'completed', label: 'Completed', count: completed.length, icon: CheckCircle },
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length, icon: Clock },
    { key: 'missed', label: 'Missed', count: missed.length, icon: AlertCircle },
  ];

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading live vaccination schedule...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Vaccination Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">National Immunization Schedule (NIS)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: completed.length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800', icon: CheckCircle },
          { label: 'Upcoming', value: upcoming.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800', icon: Clock },
          { label: 'Missed', value: missed.length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800', icon: AlertCircle },
          { label: 'Completion', value: `${vaccineData.length ? Math.round((completed.length / vaccineData.length) * 100) : 0}%`, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800', icon: Shield },
        ].map(s => (
          <div key={s.label} className={`card border ${s.bg} p-4`}>
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === tab.key
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(groupedVaccines).map(([ageGroup, vaccinesInGroup]) => (
          <div key={ageGroup} className="card p-6 border-t-4 border-primary-500">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Schedule: {ageGroup}
            </h3>
            <div className="space-y-0">
              {vaccinesInGroup.map((vaccine, i) => (
                <VaccineCard
                  key={vaccine.id}
                  vaccine={vaccine}
                  isLast={i === vaccinesInGroup.length - 1}
                  onMarkComplete={handleMarkComplete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}