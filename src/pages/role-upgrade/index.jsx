import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title={`Upgrade to ${info.label}`} showSidebar={false}>
      <div className="max-w-2xl mx-auto py-8">
        <div className={`bg-gradient-to-br ${info.color} rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-1000" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/30 group-hover:rotate-6 transition-transform">
              <Icon name={info.icon} size={40} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-black mb-3 tracking-tight uppercase">
              Upgrade to {info.label}
            </h1>
            <p className="text-lg opacity-90 font-medium max-w-md leading-relaxed">
              Unlock powerful tools to grow, engage, and monetize your audience on the Vottery platform.
            </p>
          </div>
        </div>

        <div className="premium-glass rounded-3xl shadow-2xl p-10 -mt-8 relative z-20 border border-white/10 mx-4 md:mx-0">
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Premium Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {info.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform">
                  <Icon name="Check" size={16} className="text-green-500" />
                </div>
                <span className="text-sm font-bold text-slate-200">{b}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-10">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Mission Statement (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. I run a community and want to create polls..."
              className="w-full px-6 py-5 bg-slate-900/40 border border-white/5 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium transition-all shadow-inner resize-none min-h-[120px]"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              Cancel Request
            </button>
            <button
              onClick={handleRequestUpgrade}
              disabled={submitting}
              className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
}
