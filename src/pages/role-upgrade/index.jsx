import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const ROLE_INFO = {
  creator: {
    label: 'Creator',
    icon: 'PlusCircle',
    color: 'from-purple-500 to-purple-700',
    benefits: [
      'Create elections and polls',
      'Monetize with participation fees',
      'Access creator analytics',
      'Stripe payouts',
    ],
    ctaPath: '/election-creation-studio',
  },
  advertiser: {
    label: 'Advertiser',
    icon: 'Megaphone',
    color: 'from-green-500 to-green-700',
    benefits: [
      'Run participatory ad campaigns',
      'Target engaged audiences',
      'Real-time ROI dashboards',
      'Brand registration',
    ],
    ctaPath: '/participatory-ads-studio',
  },
};

export default function RoleUpgradePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role') || 'creator';
  const info = ROLE_INFO[requestedRole] || ROLE_INFO.creator;
  const { user, userProfile } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRequestUpgrade = async () => {
    if (!user) {
      navigate('/authentication-portal');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('role_upgrade_requests').insert({
        user_id: user.id,
        requested_role: requestedRole,
        message: message || null,
        status: 'pending',
      });
      if (error) throw error;
      toast.success('Upgrade request submitted. We\'ll review it shortly.');
      navigate('/');
    } catch (e) {
      toast.error(e?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please sign in to request an upgrade.</p>
          <button
            onClick={() => navigate('/authentication-portal')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  const alreadyHasRole = userProfile?.role === requestedRole || ['admin', 'super_admin', 'manager', 'moderator'].includes(userProfile?.role);

  if (alreadyHasRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-4`}>
            <Icon name={info.icon} size={32} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">You already have {info.label} access</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Go to your {info.label.toLowerCase()} dashboard to get started.</p>
          <button
            onClick={() => navigate(info.ctaPath)}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium"
          >
            Go to {info.label} Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className={`bg-gradient-to-br ${info.color} rounded-t-xl p-6 text-white`}>
          <Icon name={info.icon} size={48} className="mb-4" />
          <h1 className="text-2xl font-bold">Upgrade to {info.label}</h1>
          <p className="opacity-90 mt-2">Unlock powerful tools to grow and monetize on Vottery.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg p-6 -mt-px">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">What you get</h2>
          <ul className="space-y-2 mb-6">
            {info.benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Icon name="Check" size={18} className="text-green-500 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tell us why you want to upgrade (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. I run a community and want to create polls..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-6 resize-none"
            rows={3}
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleRequestUpgrade}
              disabled={submitting}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Request Upgrade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
