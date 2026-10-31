import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      success('Welcome back, Nkathaa! Admin session verified.');
      navigate('/admin');
    } catch (err) {
      error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@nkathaa.com');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gradient-to-b from-[#CBB3E8]/20 via-[#F8F8F8] to-[#F8F8F8] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-lavender/50 relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#CBB3E8] text-[#333333] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Salon Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#333333]">
            Owner & Admin Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to manage appointments, hairstyles, client reviews, and revenue analytics.
          </p>
        </div>

        {/* Demo credentials hint pill */}
        <div className="mb-6 p-3 rounded-2xl bg-[#D4FF3F]/30 border border-[#D4FF3F] text-xs flex items-center justify-between">
          <div>
            <span className="font-bold text-dark-text block">Demo Admin Account:</span>
            <span className="text-[11px] text-gray-600">admin@nkathaa.com / AdminPassword123!</span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="py-1 px-2.5 rounded-lg bg-dark-text text-white text-[10px] font-bold hover:bg-black transition-colors"
          >
            Auto Fill
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              required
              placeholder="admin@nkathaa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Secret Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-heading font-bold text-sm shadow-glow-tomato transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-gray-500 hover:text-dark-text underline">
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
