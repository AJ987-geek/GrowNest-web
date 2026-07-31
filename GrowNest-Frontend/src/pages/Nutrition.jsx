import { useState, useEffect } from 'react';
import { Droplets, Zap, Apple, TrendingUp, Info, Sparkles, Send, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { calculateAge, calculateBMI, getBMIStatus } from '../utils/helpers.js';
import { GrowthChart, NutritionChart, CaloriesChart } from '../components/GrowthChart.jsx';

export default function Nutrition() {
  const { child } = useApp();
  const bmi = calculateBMI(child.weight, child.height);
  const bmiStatus = getBMIStatus(bmi);
  const age = calculateAge(child.dob);

  const [growthData, setGrowthData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [todayMacros, setTodayMacros] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [loading, setLoading] = useState(true);
  const [mealInput, setMealInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [showGrowthModal, setShowGrowthModal] = useState(false);
  const [growthForm, setGrowthForm] = useState({ month: '', height: '', weight: '' });

  const fetchData = async () => {
    try {
      const [growthRes, nutRes] = await Promise.all([
        fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}/growth`),
        fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}/nutrition`)
      ]);
      const growth = await growthRes.json();
      const nut = await nutRes.json();
      
      setGrowthData(growth);
      setNutritionData(nut);
      if (nut.length > 0) {
        // Find today's entry or just use the latest (since backend returns recent 7 ordered)
        setTodayMacros(nut[nut.length - 1]); 
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (child?.id) fetchData();
  }, [child]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!mealInput.trim()) return;
    setScanning(true);
    try {
      const res = await fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}/nutrition/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal_description: mealInput })
      });
      if (res.ok) {
        setMealInput('');
        fetchData(); // Refresh charts instantly
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset today's nutrition data?")) {
      try {
        await fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}/nutrition/today`, { method: 'DELETE' });
        fetchData();
      } catch(e) { console.error(e); }
    }
  };

  const handleResetGrowth = async () => {
    if (confirm("Are you sure you want to permanently delete all growth records for this child?")) {
      try {
        await fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}/growth`, { method: 'DELETE' });
        fetchData();
      } catch(e) { console.error(e); }
    }
  };

  const submitGrowthLog = async (e) => {
    e.preventDefault();
    const { month, height, weight } = growthForm;
    if (month && height && weight) {
      try {
        await fetch(`https://grownest-backend-5xa2.onrender.com/api/children/${child.id}/growth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ month, height: Number(height), weight: Number(weight) })
        });
        fetchData();
        setShowGrowthModal(false);
        setGrowthForm({ month: '', height: '', weight: '' });
      } catch(err) { console.error(err); }
    }
  };

  const getAgeInYears = (dob) => {
    if (!dob) return 5; // Default age 5
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return Math.max(0, age);
  };

  const getDailyTargets = (age) => {
    if (age <= 3) return { calories: 1000, protein: 13, water: 4, carbs: 130 };
    if (age <= 8) return { calories: 1400, protein: 19, water: 5, carbs: 130 };
    if (age <= 13) return { calories: 1800, protein: 34, water: 7, carbs: 130 };
    return { calories: 2200, protein: 46, water: 8, carbs: 130 };
  };

  const ageNum = getAgeInYears(child?.dob);
  const targets = getDailyTargets(ageNum);

  const dailyNeeds = [
    { label: 'Daily Calories', value: `${targets.calories}`, unit: 'kcal', current: todayMacros.calories || 0, max: targets.calories, color: 'bg-amber-500', icon: Zap },
    { label: 'Protein', value: `${targets.protein}`, unit: 'g/day', current: todayMacros.protein || 0, max: targets.protein, color: 'bg-blue-500', icon: Apple },
    { label: 'Water Intake', value: `${targets.water}`, unit: 'glasses', current: todayMacros.water || 0, max: targets.water, color: 'bg-teal-500', icon: Droplets },
    { label: 'Carbs', value: `${targets.carbs}`, unit: 'g/day', current: todayMacros.carbs || 0, max: targets.carbs, color: 'bg-rose-500', icon: TrendingUp },
  ];

  const aiRecommendations = [
    { emoji: '🥦', title: 'Add more greens', desc: 'Vegetable intake seems low. Add broccoli or spinach to dinner.' },
    { emoji: '🥛', title: 'Calcium boost needed', desc: 'Calcium intake is below recommended. Add a glass of milk or yogurt daily.' }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Nutrition & Growth</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Tracking growth and nutritional health for {child.name} • {age}
        </p>
      </div>

      {/* AI Meal Scanner */}
      <div className="card p-6 border-2 border-primary-100 dark:border-primary-900/50 relative overflow-hidden bg-gradient-to-r from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="absolute -top-10 -right-10 opacity-10">
          <Sparkles className="w-48 h-48 text-primary-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-black text-xl text-gray-900 dark:text-white">AI Meal Scanner</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 font-medium">Just type what {child.name} ate, and Groq AI will instantly calculate the macros and calories!</p>
          <form onSubmit={handleScan} className="flex gap-3 max-w-2xl">
            <input 
              type="text" 
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              placeholder='e.g., "A bowl of oatmeal and half an apple"'
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white shadow-sm"
            />
            <button 
              disabled={scanning || !mealInput.trim()}
              type="submit" 
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
            >
              {scanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {scanning ? 'Analyzing...' : 'Log Meal'}
            </button>
          </form>
        </div>
      </div>

      {/* BMI + Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'BMI', value: bmi, sub: bmiStatus.label, color: bmiStatus.color },
          { label: 'Height', value: `${child.height} cm`, sub: '65th percentile', color: 'text-primary-600' },
          { label: 'Weight', value: `${child.weight} kg`, sub: '55th percentile', color: 'text-teal-600' },
          { label: 'Growth Status', value: 'Normal', sub: 'On track', color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Daily needs with progress bars */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Today's Nutritional Progress 
            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full dark:bg-primary-900/30 dark:text-primary-400">Live AI Sync</span>
          </h2>
          <button onClick={handleReset} className="text-xs text-red-500 hover:text-red-700 font-semibold hover:underline bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full transition-colors">
            Reset Today
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {dailyNeeds.map(need => {
            const isDanger = need.current > need.max;
            const barColor = isDanger ? 'bg-red-500' : need.color;
            const percentage = Math.min((need.current / need.max) * 100, 100);

            return (
              <div key={need.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <need.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{need.label}</span>
                    {isDanger && <span className="text-[10px] text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider">Danger Zone</span>}
                  </div>
                  <span className={`text-sm font-bold ${isDanger ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {need.current} <span className="text-gray-400 font-normal">/ {need.max} {need.unit}</span>
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Target: {need.value}</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="font-bold text-gray-900 dark:text-white">Growth Chart (Last 12 months)</h2>
             <div className="flex gap-2">
               <button onClick={handleResetGrowth} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-100 transition-colors">
                 Reset
               </button>
               <button onClick={() => setShowGrowthModal(true)} className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold hover:bg-primary-200 transition-colors">
                 + Log Growth
               </button>
             </div>
          </div>
          {growthData.length > 0 ? (
            <GrowthChart data={growthData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-xl">No growth data recorded yet.</div>
          )}
        </div>
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Nutrition Breakdown</h2>
          {nutritionData.length > 0 ? (
            <NutritionChart data={nutritionData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-xl">Scan a meal to see charts!</div>
          )}
        </div>
      </div>

      {/* Calorie trend */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Calorie Intake This Week</h2>
        {nutritionData.length > 0 ? (
          <CaloriesChart data={nutritionData} />
        ) : (
           <div className="h-64 flex items-center justify-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-xl">Log some meals to build your calorie trend!</div>
        )}
      </div>

      {/* Growth Modal */}
      {showGrowthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Log Growth Data</h3>
              <button onClick={() => setShowGrowthModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold leading-none">
                &times;
              </button>
            </div>
            <form onSubmit={submitGrowthLog} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Month</label>
                <select 
                  required 
                  value={growthForm.month} 
                  onChange={e => setGrowthForm({...growthForm, month: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="" disabled>Select a month</option>
                  {Array.from({length: 12}).map((_, i) => {
                    const d = new Date();
                    d.setDate(1); // Prevent rollover bug on the 31st of the month
                    d.setMonth(d.getMonth() - i);
                    const mName = d.toLocaleString('default', { month: 'short' });
                    return <option key={i} value={mName}>{mName} {d.getFullYear()}</option>;
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                  <input required type="number" value={growthForm.height} onChange={e => setGrowthForm({...growthForm, height: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="105" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                  <input required type="number" value={growthForm.weight} onChange={e => setGrowthForm({...growthForm, weight: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="18" />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl py-3 shadow-md shadow-primary-500/30 transition-all">Save Record</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
