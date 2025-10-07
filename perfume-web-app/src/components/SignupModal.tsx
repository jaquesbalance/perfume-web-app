/**
 * Signup Modal Component
 * Allows users to create a new account
 */

import { useState, FormEvent } from 'react';
import { Loader2, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { useAuth } from '../contexts/AuthContext';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const { register, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError('');

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      await register({ email, password, name: name || undefined });
      // Success - modal will close automatically
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setPasswordError('');
    clearError();
    onClose();
  };

  const handleSwitchToLogin = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setPasswordError('');
    clearError();
    onSwitchToLogin();
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Success Message - Why join */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h3 className="text-primary-900 font-semibold text-sm mb-2">
            Save Your Fragrance Journey
          </h3>
          <ul className="text-primary-700 text-sm space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Save your favorite perfumes
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Get personalized recommendations
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Access from any device
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {(error || passwordError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold text-sm">Registration Failed</p>
              <p className="text-red-600 text-sm mt-1">{error || passwordError}</p>
            </div>
          </div>
        )}

        {/* Name Field (Optional) */}
        <div>
          <label htmlFor="signup-name" className="block text-sm font-semibold text-slate-700 mb-2">
            Name <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="signup-email"
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
          <label htmlFor="signup-password" className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
              disabled={isLoading}
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="signup-confirm-password" className="block text-sm font-semibold text-slate-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                confirmPassword && !passwordsMatch
                  ? 'border-red-300'
                  : 'border-slate-300'
              }`}
              required
              disabled={isLoading}
              autoComplete="new-password"
              minLength={8}
            />
            {passwordsMatch && (
              <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">Already have an account?</span>
          </div>
        </div>

        {/* Switch to Login */}
        <button
          type="button"
          onClick={handleSwitchToLogin}
          disabled={isLoading}
          className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign In
        </button>
      </form>
    </Modal>
  );
}
