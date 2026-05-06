import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const MODULES = [
  { id: 'onboarding', title: 'Getting started', description: 'Set up your first election, share the link, and understand the dashboard.', tier: 'all', icon: 'Rocket' },
  { id: 'best-practices', title: 'Best practices', description: 'How to write clear titles, add options, and set end dates for maximum participation.', tier: 'all', icon: 'BookOpen' },
  { id: 'participation', title: 'Boost participation', description: 'Use voter rolls, magic links, and social sharing to grow turnout.', tier: 'growth', icon: 'Users' },
  { id: 'monetization', title: 'Fees and prizes', description: 'Optional participation fees, regional pricing, and prize distribution.', tier: 'growth', icon: 'DollarSign' },
  { id: 'analytics', title: 'Analytics and reports', description: 'Live results, abstention reports, and export for compliance.', tier: 'pro', icon: 'BarChart' },
  { id: 'compliance', title: 'Compliance and audit', description: 'Vote change approval, audit markers, and creator controls.', tier: 'pro', icon: 'Shield' }
];

const MILESTONES = [
  { label: 'First election created', metric: 'elections', value: 1 },
  { label: '10 participants', metric: 'votes', value: 10 },
  { label: '50 participants', metric: 'votes', value: 50 },
  { label: 'First paid election', metric: 'paid_elections', value: 1 },
  { label: '100 participants', metric: 'votes', value: 100 }
];

const CreatorSuccessAcademy = () => {
  const [selectedTier, setSelectedTier] = useState('all');

  const filteredModules = MODULES.filter(m =>
    selectedTier === 'all' || m.tier === selectedTier || m.tier === 'all'
  );

  const tierColors = {
    all: 'All Tiers',
    growth: 'Growth',
    pro: 'Pro'
  };

  const tierBadgeColors = {
    growth: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pro: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <GeneralPageLayout title="Creator Success Academy" showSidebar={true}>
      <div className="w-full py-0">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
            Creator Success Academy
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium">
            Onboarding, tier-specific modules, and milestones to grow as an election creator.
          </p>
        </div>

        {/* Learning Modules */}
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 mb-8 shadow-2xl">
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6">Learning Modules</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'growth', 'pro'].map(tier => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedTier === tier
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {tierColors[tier]}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {filteredModules.map(m => (
              <div key={m.id} className="flex gap-5 p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                  <Icon name={m.icon} size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-tight">{m.title}</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1">{m.description}</p>
                  {m.tier !== 'all' && (
                    <span className={`inline-block mt-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${tierBadgeColors[m.tier]}`}>
                      {m.tier}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Milestones */}
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 mb-8 shadow-2xl">
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Achievement Milestones</h2>
          <p className="text-sm text-slate-400 font-medium mb-6">
            Track your progress; unlock badges and insights as you hit these goals.
          </p>
          <div className="space-y-3">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <div className="p-2.5 bg-yellow-500/10 rounded-xl group-hover:bg-yellow-500/20 transition-all">
                  <Icon name="Award" size={20} className="text-yellow-400" />
                </div>
                <span className="text-white font-bold">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Link to="/election-creation-studio">
            <Button className="rounded-2xl font-black uppercase tracking-widest text-xs px-8 py-4">
              <Icon name="Plus" size={18} className="mr-2" />
              Create your first election
            </Button>
          </Link>
          <Link to="/creator-reputation-election-management-system">
            <Button variant="outline" className="rounded-2xl font-black uppercase tracking-widest text-xs px-8 py-4">
              <Icon name="Award" size={18} className="mr-2" />
              Creator reputation &amp; management
            </Button>
          </Link>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default CreatorSuccessAcademy;
