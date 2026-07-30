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
    <div className="min-h-screen flex relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Decorative circles for the entire page */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary-50 dark:bg-gray-800/30 blur-2xl" />
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-teal-50 dark:bg-gray-800/30 blur-2xl" />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 border-r border-gray-100 dark:border-gray-800">
        <div className="flex flex-col justify-center px-12 text-gray-900 dark:text-white w-full">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <img src="/logo.png" alt="GrowNest Logo" className="w-14 h-14 object-cover" />
            <span className="text-2xl font-black gradient-text">GrowNest</span>
          </Link>
          <h2 className="text-4xl font-black mb-4 leading-tight">Welcome Back, Super Parent! 👋</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
            Sign in to access your child's complete health dashboard, AI assistant, and personalized insights.
          </p>
          <div className="space-y-4">
            {['Real-time health monitoring', 'AI-powered recommendations', 'Vaccination schedule tracker', 'Community support'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-white rounded-xl p-1.5 shadow-md">
              <img src="/logo.png" alt="GrowNest Logo" className="w-10 h-10 object-cover" />
            </div>
            <span className="text-xl font-bold gradient-text">GrowNest</span>
          </Link>

          <div className="card p-8 shadow-xl">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Sign in</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Create one</Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className={`input pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Password</label>
                  <Link to="#" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className={`input pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-base py-3.5"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-700" />
              </div>
              <div className="relative text-center">
                <span className="text-xs text-gray-400 bg-white dark:bg-gray-800 px-3">or continue with demo</span>
              </div>
            </div>

            <button
              onClick={() => { showToast('Demo login successful!', 'success'); navigate('/dashboard'); }}
              className="w-full btn-outline text-sm py-2.5"
            >
              🚀 Try Demo Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
