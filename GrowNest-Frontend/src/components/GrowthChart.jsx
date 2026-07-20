import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}{entry.unit || ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function GrowthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="heightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#389af4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#389af4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-gray-500" />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} className="text-gray-500" />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} className="text-gray-500" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area yAxisId="left" type="monotone" dataKey="height" stroke="#389af4" strokeWidth={2} fill="url(#heightGrad)" name="Height (cm)" dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Area yAxisId="right" type="monotone" dataKey="weight" stroke="#14b8a6" strokeWidth={2} fill="url(#weightGrad)" name="Weight (kg)" dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function NutritionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="protein" stackId="a" fill="#389af4" name="Protein (g)" radius={[0,0,0,0]} />
        <Bar dataKey="carbs" stackId="a" fill="#14b8a6" name="Carbs (g)" radius={[0,0,0,0]} />
        <Bar dataKey="fat" stackId="a" fill="#a78bfa" name="Fat (g)" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CaloriesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} domain={[900, 1600]} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} activeDot={{ r: 6 }} name="Calories" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GrowthChart;
