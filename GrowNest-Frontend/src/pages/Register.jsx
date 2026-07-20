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
    <div className="min-h-screen flex bg-gradient-to-br from-teal-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-black">GrowNest AI</span>
          </Link>
          <h2 className="text-4xl font-black mb-4">Join 50,000+ Families Today 🌟</h2>
          <p className="text-teal-100 text-lg mb-8">Create your free account and start giving your child the best possible healthcare support.</p>
          <div className="grid grid-cols-2 gap-4">
            {[['Free Plan', 'No credit card needed'], ['AI Assistant', '24/7 support'], ['Secure', 'HIPAA compliant'], ['Multi-child', 'Up to 6 profiles']].map(([t, d]) => (
              <div key={t} className="bg-white/10 rounded-xl p-3">
                <p className="font-bold text-sm mb-1">{t}</p>
                <p className="text-teal-100 text-xs">{d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold gradient-text">GrowNest AI</span>
          </Link>

          <div className="card p-8 shadow-xl">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Parent Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className={`input pl-10 ${errors.name ? 'border-red-400' : ''}`} placeholder="Sarah Johnson" />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className={`input pl-10 ${errors.email ? 'border-red-400' : ''}`} placeholder="sarah@example.com" />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className={`input pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`} placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                    className={`input pl-10 ${errors.confirm ? 'border-red-400' : ''}`} placeholder="Repeat password" />
                  {form.confirm && form.password === form.confirm && (
                    <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  )}
                </div>
                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
              </div>

              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreed && <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5 mt-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : (
                  <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
