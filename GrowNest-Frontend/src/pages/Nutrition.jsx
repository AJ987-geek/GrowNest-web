import { Droplets, Zap, Apple, TrendingUp, Info } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { calculateAge, calculateBMI, getBMIStatus } from '../utils/helpers.js';
import { GrowthChart, NutritionChart, CaloriesChart } from '../components/GrowthChart.jsx';
import { growthData, nutritionData } from '../data/sampleData.js';

export default function Nutrition() {
  const { child } = useApp();
  const bmi = calculateBMI(child.weight, child.height);
  const bmiStatus = getBMIStatus(bmi);
  const age = calculateAge(child.dob);

  const dailyNeeds = [
    { label: 'Daily Calories', value: '1200–1400', unit: 'kcal', current: 1280, max: 1400, color: 'bg-amber-500', icon: Zap },
    { label: 'Protein', value: '30–35', unit: 'g/day', current: 32, max: 35, color: 'bg-blue-500', icon: Apple },
    { label: 'Water Intake', value: '5–6', unit: 'glasses/day', current: 4, max: 6, color: 'bg-teal-500', icon: Droplets },
    { label: 'Iron', value: '10', unit: 'mg/day', current: 8, max: 10, color: 'bg-red-500', icon: TrendingUp },
  ];

  const aiRecommendations = [
    { emoji: '🥦', title: 'Add more greens', desc: 'Emma is getting only 60% of daily fiber. Add broccoli or spinach to lunch.' },
    { emoji: '🥛', title: 'Calcium boost needed', desc: 'Calcium intake is below recommended. Add a glass of milk or yogurt daily.' },
    { emoji: '🍊', title: 'Great Vitamin C', desc: 'Excellent Vitamin C intake this week! Keep up the fruit servings.' },
    { emoji: '💧', title: 'Hydration alert', desc: 'Water intake is 20% below target. Encourage drinking between meals.' },
  ];

  const weeklyMeals = [
    { day: 'Mon', breakfast: 'Oatmeal + banana', lunch: 'Chicken rice bowl', dinner: 'Veggie pasta', snack: 'Apple slices' },
    { day: 'Tue', breakfast: 'Egg toast + OJ', lunch: 'Dal + roti', dinner: 'Grilled fish + veggies', snack: 'Yogurt' },
    { day: 'Wed', breakfast: 'Pancakes + berries', lunch: 'Sandwich + soup', dinner: 'Dal khichdi', snack: 'Nuts & raisins' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Nutrition & Growth</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Tracking growth and nutritional health for {child.name} • {age}
        </p>
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
        <h2 className="font-bold text-gray-900 dark:text-white mb-5">Daily Nutritional Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {dailyNeeds.map(need => (
            <div key={need.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <need.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{need.label}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{need.current} / {need.max} {need.unit}</span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${need.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${(need.current / need.max) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Recommended: {need.value} {need.unit}</span>
                <span>{Math.round((need.current / need.max) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Growth Chart (12 months)</h2>
          <GrowthChart data={growthData} />
        </div>
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Nutrition Breakdown</h2>
          <NutritionChart data={nutritionData} />
        </div>
      </div>

      {/* Calorie trend */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Calorie Intake This Week</h2>
        <CaloriesChart data={nutritionData} />
      </div>

      {/* AI Recommendations */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
            <Info className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white">AI Nutrition Insights</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aiRecommendations.map(r => (
            <div key={r.title} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <span className="text-2xl">{r.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal log sample */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Recent Meal Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                {['Day', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map(h => (
                  <th key={h} className="pb-3 pr-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {weeklyMeals.map(m => (
                <tr key={m.day} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-primary-600 dark:text-primary-400">{m.day}</td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{m.breakfast}</td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{m.lunch}</td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{m.dinner}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{m.snack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
