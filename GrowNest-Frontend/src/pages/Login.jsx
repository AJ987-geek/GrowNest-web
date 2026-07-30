import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { showToast, setActiveUserId } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
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
      // Send the login request to our new backend route
      const response = await fetch('https://grownest-backend-5xa2.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Save the userId to the browser session
        localStorage.setItem('userId', data.userId);
        // Force the AppContext to fetch this user's data from MySQL
        setActiveUserId(data.userId);

        showToast('Welcome back! Login successful.', 'success');
        window.location.href = '/dashboard';
      } else {
        // Incorrect password or email
        showToast(data.error || 'Login failed', 'error');
        setErrors({ email: data.error });
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Network error. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };
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
            <img src="/logo.png" alt="GrowNest Logo" className="w-16 h-16 object-cover" />
            <span className="text-3xl font-black gradient-text">GrowNest</span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome Back! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Sign in to access your child's complete health dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={`input pl-11 py-3 ${errors.email ? 'border-red-400 focus:ring-red-400' : 'bg-white/50 dark:bg-gray-800/50'}`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Password</label>
              <Link to="#" className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className={`input pl-11 pr-11 py-3 ${errors.password ? 'border-red-400 focus:ring-red-400' : 'bg-white/50 dark:bg-gray-800/50'}`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5 shadow-lg shadow-primary-500/30">
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
            ) : (
              <><span>Sign In</span><ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8 mb-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Create one</Link>
        </p>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative text-center">
            <span className="text-xs text-gray-400 bg-white/0 px-3 uppercase tracking-wider font-semibold">Or</span>
          </div>
        </div>

        <button onClick={() => { showToast('Demo login successful!', 'success'); navigate('/dashboard'); }} className="w-full btn-outline bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm py-3 border-gray-200 dark:border-gray-700">
          🚀 Try Demo Account
        </button>
      </div>
    </div>
  );
}
