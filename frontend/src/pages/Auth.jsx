import React, { useState, useContext } from 'react';
import { AuthContext } from '@/App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Frontend-only mock auth
      const existing = JSON.parse(localStorage.getItem('mock_users') || '[]');
      if (isLogin) {
        const user = existing.find(u => u.email === formData.email && u.password === formData.password);
        if (!user) throw new Error('Invalid credentials');
        const token = `t_${Date.now()}`;
        login(token, { name: user.name || 'User', email: user.email, is_admin: !!user.is_admin });
        toast.success('Welcome back!');
      } else {
        if (existing.some(u => u.email === formData.email)) throw new Error('Email already registered');
        const newUser = { name: formData.name, email: formData.email, password: formData.password, is_admin: false };
        localStorage.setItem('mock_users', JSON.stringify([...existing, newUser]));
        const token = `t_${Date.now()}`;
        login(token, { name: newUser.name, email: newUser.email, is_admin: false });
        toast.success('Account created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" data-testid="auth-page">
      <div className="max-w-md w-full glass-effect p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold luxury-text mb-2" data-testid="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Start your luxury shopping journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="auth-form">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
                required={!isLogin}
                data-testid="auth-name-input"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
              required
              data-testid="auth-email-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b4513]"
              required
              data-testid="auth-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-luxury py-3 disabled:opacity-50"
            data-testid="auth-submit-btn"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#8b4513] hover:underline font-medium"
            data-testid="auth-toggle-btn"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;