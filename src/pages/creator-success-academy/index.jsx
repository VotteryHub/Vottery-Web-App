import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
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

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Creator Success Academy
          </h1>
          <p className="text-muted-foreground">
            Onboarding, tier-specific modules, and milestones to grow as an election creator.
          </p>
        </div>

        <section className="card p-6 mb-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Learning modules</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', 'growth', 'pro'].map(tier => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedTier === tier ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {tier === 'all' ? 'All' : tier === 'growth' ? 'Growth' : 'Pro'}
              </button>
            ))}
          </div>
          <ul className="space-y-4">
            {filteredModules.map(m => (
              <li key={m.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon name={m.icon} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.description}</p>
                  {m.tier !== 'all' && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{m.tier}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6 mb-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Achievement milestones</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Track your progress; unlock badges and insights as you hit these goals.
          </p>
          <ul className="space-y-2">
            {MILESTONES.map((m, i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Icon name="Award" size={20} className="text-primary flex-shrink-0" />
                <span className="text-foreground">{m.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-wrap gap-4">
          <Link to="/election-creation-studio">
            <Button variant="default">
              <Icon name="Plus" size={18} />
              Create your first election
            </Button>
          </Link>
          <Link to="/creator-reputation-election-management-system">
            <Button variant="outline">
              <Icon name="Award" size={18} />
              Creator reputation &amp; management
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default CreatorSuccessAcademy;
