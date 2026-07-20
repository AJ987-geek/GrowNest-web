import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Baby, Scale, Heart, Utensils, Activity, Syringe, ArrowRight, TrendingUp, Star, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { calculateAge, calculateBMI, getBMIStatus, getHealthScore } from '../utils/helpers.js';
import DashboardCard from '../components/DashboardCard.jsx';
import { GrowthChart } from '../components/GrowthChart.jsx';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';
import { growthData, vaccineData } from '../data/sampleData.js';

export default function Dashboard() {
  const { child, appLoading } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (appLoading) {
    return <div className="flex h-[50vh] items-center justify-center">Loading dashboard...</div>;
  }

  if (!child) {
    return <Navigate to="/onboarding" replace />;
  }

  const age = calculateAge(child.dob);
  const bmi = calculateBMI(child.weight, child.height);
  const bmiStatus = getBMIStatus(bmi);
  const healthScore = getHealthScore(parseFloat(bmi), 9, 87);
  const nextVaccine = vaccineData.find(v => v.status === 'upcoming');
  const missedVaccines = vaccineData.filter(v => v.status === 'missed').length;

  const cards = [
    { title: 'Child Age', value: age, subtitle: `Born ${child.dob}`, icon: Baby, gradient: 'bg-gradient-to-br from-blue-400 to-blue-600', trend: null },
    { title: 'BMI Status', value: bmi, subtitle: bmiStatus.label, icon: Scale, gradient: 'bg-gradient-to-br from-teal-400 to-teal-600', trend: 'up', trendValue: '+0.3' },
    { title: 'Health Score', value: `${healthScore}/100`, subtitle: healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs attention', icon: Heart, gradient: 'bg-gradient-to-br from-rose-400 to-rose-600', trend: 'up', trendValue: '+5' },
    { title: 'Nutrition Score', value: '87/100', subtitle: 'Above average', icon: Utensils, gradient: 'bg-gradient-to-br from-emerald-400 to-emerald-600', trend: 'up', trendValue: '+2' },
    { title: 'Activity Score', value: '72/100', subtitle: 'Moderate', icon: Activity, gradient: 'bg-gradient-to-br from-purple-400 to-purple-600', trend: 'down', trendValue: '-3' },
    { title: 'Next Vaccine', value: nextVaccine ? nextVaccine.name : 'Up to date', subtitle: nextVaccine ? nextVaccine.date : '✓ All clear', icon: Syringe, gradient: 'bg-gradient-to-br from-amber-400 to-amber-600', trend: null },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Good morning! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
            Here's your daily health overview for <span className="font-semibold text-primary-600 dark:text-primary-400">{child.name}</span>
          </p>
        </div>
        <Link to="/child-profile" className="btn-secondary text-sm hidden sm:flex">
          View Profile
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Alert for missed vaccines */}
      {missedVaccines > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 animate-slide-up">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{missedVaccines} Missed Vaccine{missedVaccines > 1 ? 's' : ''}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Please schedule a catch-up appointment with your pediatrician.</p>
          </div>
          <Link to="/vaccination" className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline whitespace-nowrap">View →</Link>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          cards.map(card => <DashboardCard key={card.title} {...card} />)
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Growth Trajectory</h2>
              <p className="text-xs text-gray-500 mt-0.5">Height & weight over the last 12 months</p>
            </div>
            <Link to="/nutrition" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1">
              Full report <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <GrowthChart data={growthData} />
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Health Overview</h3>
            <div className="space-y-3">
              {[
                { label: 'Height', value: `${child.height} cm`, percent: 65, color: 'bg-primary-500' },
                { label: 'Weight', value: `${child.weight} kg`, percent: 55, color: 'bg-teal-500' },
                { label: 'BMI', value: bmi, percent: 70, color: 'bg-emerald-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Today's Tasks</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Morning vitamin D', done: true },
                { label: 'Drink 6 glasses water', done: true },
                { label: '1hr outdoor activity', done: false },
                { label: 'Read for 20 minutes', done: false },
              ].map(task => (
                <div key={task.label} className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-emerald-500' : 'border-2 border-gray-200 dark:border-gray-700'}`}>
                    {task.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className={`text-xs ${task.done ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>{task.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI Tip of the Day</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Children aged 5 need 10–13 hours of sleep daily. A consistent bedtime routine improves sleep quality by 40%.
            </p>
            <Link to="/assistant" className="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-2 inline-block hover:underline">Ask AI Assistant →</Link>
          </div>
        </div>
      </div>

      {/* Upcoming vaccines */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">Upcoming Vaccinations</h2>
          <Link to="/vaccination" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1">
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {vaccineData.filter(v => v.status === 'upcoming').map(v => (
            <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Syringe className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{v.name}</p>
                <p className="text-xs text-gray-500">{v.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
