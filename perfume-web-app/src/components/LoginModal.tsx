/**
 * Login Modal Component
 * Allows users to sign in with email/password
 */

import { useState, FormEvent } from 'react';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      // Success - modal will close automatically
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    clearError();
    onClose();
  };

  const handleSwitchToSignup = () => {
    setEmail('');
    setPassword('');
    clearError();
    onSwitchToSignup();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold text-sm">Login Failed</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
              disabled={isLoading}
              autoComplete="current-password"
              minLength={6}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">Don't have an account?</span>
          </div>
        </div>

        {/* Switch to Signup */}
        <button
          type="button"
          onClick={handleSwitchToSignup}
          disabled={isLoading}
          className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account
        </button>
      </form>
    </Modal>
  );
}
