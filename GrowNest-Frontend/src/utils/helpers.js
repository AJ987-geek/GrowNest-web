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

export const getAgeInYears = (dob) => {
  if (!dob) return 5;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return Math.max(0, age);
};

export const getDailyTargets = (age) => {
  if (age <= 3) return { calories: 1000, protein: 13, water: 4, carbs: 130 };
  if (age <= 8) return { calories: 1400, protein: 19, water: 5, carbs: 130 };
  if (age <= 13) return { calories: 1800, protein: 34, water: 7, carbs: 130 };
  return { calories: 2200, protein: 46, water: 8, carbs: 130 };
};

export const getNutritionScore = (todayMacros, age) => {
  if (!todayMacros) return 0;
  const targets = getDailyTargets(age);
  let score = 0;
  
  const calcCat = (current, target, weight) => {
    if (!current) return 0;
    const ratio = current / target;
    if (ratio >= 0.8 && ratio <= 1.2) return weight; // Perfect
    if (ratio < 0.8) return weight * (ratio / 0.8); // Under-eating
    return Math.max(0, weight - ((ratio - 1.2) * weight)); // Over-eating penalty
  };

  score += calcCat(todayMacros.calories, targets.calories, 30);
  score += calcCat(todayMacros.protein, targets.protein, 30);
  score += calcCat(todayMacros.water, targets.water, 20);
  score += calcCat(todayMacros.carbs, targets.carbs, 20);

  return Math.round(score);
};

export const getActivityScore = (activities) => {
  if (!activities || activities.length === 0) return 0;
  
  let score = 0;
  activities.forEach(act => {
    if (act.category === 'physical') {
      score += 15;
    } else if (act.category === 'learning') {
      score += 10;
    }
  });

  return Math.min(100, Math.round(score));
};
