import React, { useState } from 'react';
import { Shield, UserPlus, X, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const ExternalVoterGate = ({ onRegistered, onClose, electionId }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('welcome'); // welcome | register | verify
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: signUpError } = await supabase?.auth?.signUp({
        email: formData?.email,
        password: formData?.password,
        options: { data: { name: formData?.name, full_name: formData?.name } }
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        setStep('verify');
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: signInError } = await supabase?.auth?.signInWithPassword({
        email: formData?.email,
        password: formData?.password
      });

      if (signInError) throw signInError;

      if (data?.user) {
        onRegistered?.();
      }
    } catch (err) {
      setError(err?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToFullAuth = () => {
    navigate(`/multi-authentication-gateway?redirect=/secure-voting-interface?election=${electionId}&ref=external`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <span className="font-bold text-lg">Secure Voting</span>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-blue-100 text-sm">You need an account to participate in this election</p>
        </div>

        <div className="p-6">
          {step === 'welcome' && (
            <div className="space-y-4">
              <div className="text-center">
                <UserPlus className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Join to Vote</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You've been invited to participate in this election. Create a free account to cast your vote.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setStep('register')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <span className="font-medium">Create New Account</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setStep('signin')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="font-medium">Sign In to Existing Account</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={goToFullAuth}
                  className="w-full text-sm text-blue-600 hover:underline text-center py-2"
                >
                  More sign-in options (Google, Apple, etc.)
                </button>
              </div>
            </div>
          )}

          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Account</h3>
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>
              )}
              <input
                type="text"
                placeholder="Full Name"
                value={formData?.name}
                onChange={e => setFormData(p => ({ ...p, name: e?.target?.value }))}
                required
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData?.email}
                onChange={e => setFormData(p => ({ ...p, email: e?.target?.value }))}
                required
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={formData?.password}
                onChange={e => setFormData(p => ({ ...p, password: e?.target?.value }))}
                required
                minLength={8}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating Account...' : 'Create Account & Vote'}
              </button>
              <button type="button" onClick={() => setStep('welcome')} className="w-full text-sm text-gray-500 hover:text-gray-700">
                ← Back
              </button>
            </form>
          )}

          {step === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sign In</h3>
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={formData?.email}
                onChange={e => setFormData(p => ({ ...p, email: e?.target?.value }))}
                required
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData?.password}
                onChange={e => setFormData(p => ({ ...p, password: e?.target?.value }))}
                required
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing In...' : 'Sign In & Vote'}
              </button>
              <button type="button" onClick={() => setStep('welcome')} className="w-full text-sm text-gray-500 hover:text-gray-700">
                ← Back
              </button>
            </form>
          )}

          {step === 'verify' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Created!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please check your email to verify your account, then return to vote.
              </p>
              <button
                onClick={onRegistered}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Continue to Vote
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalVoterGate;
