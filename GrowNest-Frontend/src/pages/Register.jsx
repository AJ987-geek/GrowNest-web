import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { showToast, setActiveUserId } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (!agreed) errs.agreed = 'You must agree to the terms';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      // Send the data to your Express backend
      const response = await fetch('https://grownest-backend-5xa2.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password_hash: form.password, // Ideally, we will hash this on the backend later!
          username: form.email.split('@')[0], // Generate a temporary username from the email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userId', data.userId);
        setActiveUserId(data.userId);

        showToast('Account created successfully! Welcome to GrowNest AI 🎉', 'success');
        navigate('/dashboard');
      } else {
        showToast(data.error || 'Failed to create account', 'error');
        setErrors({ email: data.error }); // E.g., if email is already taken
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Network error. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Weak', color: 'bg-red-500' },
      { score: 2, label: 'Fair', color: 'bg-amber-500' },
      { score: 3, label: 'Good', color: 'bg-blue-500' },
      { score: 4, label: 'Strong', color: 'bg-emerald-500' },
    ];
    return levels[score];
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">
      {/* 3D Depth Animated Orbs */}
      <div className="absolute top-0 -left-20 w-[600px] h-[600px] rounded-full bg-primary-300/30 dark:bg-primary-900/40 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] rounded-full bg-teal-300/30 dark:bg-teal-900/40 blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-[100%] bg-indigo-300/20 dark:bg-indigo-900/30 blur-[120px] -z-0" />

      {/* Main Glassmorphism Card (Single Div, No Partitions) */}
      <div className="relative z-10 w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-3xl rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-gray-700/50 p-8 sm:p-10">
        
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="GrowNest Logo" className="w-16 h-16 object-cover mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:rounded-xl" />
            <span className="text-3xl font-black gradient-text">GrowNest</span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Create Account 🌟</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Start giving your child the best healthcare support.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Parent Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={`input pl-11 py-3 ${errors.name ? 'border-red-400 focus:ring-red-400' : 'bg-white/50 dark:bg-gray-800/50'}`} placeholder="Sarah Johnson" />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={`input pl-11 py-3 ${errors.email ? 'border-red-400 focus:ring-red-400' : 'bg-white/50 dark:bg-gray-800/50'}`} placeholder="sarah@example.com" />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className={`input pl-11 pr-11 py-3 ${errors.password ? 'border-red-400 focus:ring-red-400' : 'bg-white/50 dark:bg-gray-800/50'}`} placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{strength.label} password</p>
              </div>
            )}
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                className={`input pl-11 py-3 ${errors.confirm ? 'border-red-400 focus:ring-red-400' : 'bg-white/50 dark:bg-gray-800/50'}`} placeholder="Repeat password" />
              {form.confirm && form.password === form.confirm && (
                <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-500" />
              )}
            </div>
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5 shadow-lg shadow-primary-500/30 mt-4">
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
            ) : (
              <><span>Create Account</span><ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8 mb-2">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
