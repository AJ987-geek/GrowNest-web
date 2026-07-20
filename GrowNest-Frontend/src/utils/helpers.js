export const calculateAge = (dob) => {
  const birth = new Date(dob);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 12) return `${totalMonths} months`;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return m > 0 ? `${y} yrs ${m} mo` : `${y} years`;
};

export const calculateBMI = (weight, height) => {
  const heightM = height / 100;
  return (weight / (heightM * heightM)).toFixed(1);
};

export const getBMIStatus = (bmi, age) => {
  const b = parseFloat(bmi);
  if (b < 14.5) return { label: 'Underweight', color: 'text-amber-600', bg: 'bg-amber-100' };
  if (b < 17.5) return { label: 'Healthy', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  if (b < 19.5) return { label: 'Overweight', color: 'text-orange-600', bg: 'bg-orange-100' };
  return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-100' };
};

export const getHealthScore = (bmi, vaccinesCompleted, nutritionScore) => {
  const bmiScore = bmi >= 14.5 && bmi <= 17.5 ? 35 : bmi >= 13 && bmi <= 19 ? 25 : 15;
  const vaccineScore = Math.min(35, vaccinesCompleted * 3);
  const nutriScore = Math.min(30, nutritionScore * 0.3);
  return Math.min(100, Math.round(bmiScore + vaccineScore + nutriScore));
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getDaysUntil = (dateStr) => {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
