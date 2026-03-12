import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const ScenarioModelingPanel = ({ timeframe }) => {
  const [selectedScenario, setSelectedScenario] = useState('optimistic');
  const [customInputs, setCustomInputs] = useState({
    prizePoolIncrease: 10,
    userGrowthRate: 15,
    engagementBoost: 8
  });

  const scenarios = {
    optimistic: {
      label: 'Optimistic Scenario',
      description: 'Best-case projections with favorable market conditions',
      assumptions: [
        '25% user growth rate',
        '20% increase in average prize pools',
        '15% engagement boost from new features',
        'Successful marketing campaigns'
      ],
      projections: {
        revenue: { current: 892000, projected: 1245000, growth: '+39.6%' },
        users: { current: 125000, projected: 156000, growth: '+24.8%' },
        elections: { current: 4567, projected: 6234, growth: '+36.5%' },
        engagement: { current: 78, projected: 92, growth: '+17.9%' }
      },
      probability: 35
    },
    realistic: {
      label: 'Realistic Scenario',
      description: 'Most likely outcome based on historical trends',
      assumptions: [
        '15% user growth rate',
        '10% increase in average prize pools',
        '8% engagement boost from optimizations',
        'Steady market conditions'
      ],
      projections: {
        revenue: { current: 892000, projected: 1024000, growth: '+14.8%' },
        users: { current: 125000, projected: 144000, growth: '+15.2%' },
        elections: { current: 4567, projected: 5234, growth: '+14.6%' },
        engagement: { current: 78, projected: 84, growth: '+7.7%' }
      },
      probability: 50
    },
    pessimistic: {
      label: 'Pessimistic Scenario',
      description: 'Conservative projections with challenging conditions',
      assumptions: [
        '5% user growth rate',
        'Flat prize pool levels',
        '3% engagement improvement',
        'Increased competition'
      ],
      projections: {
        revenue: { current: 892000, projected: 934000, growth: '+4.7%' },
        users: { current: 125000, projected: 131000, growth: '+4.8%' },
        elections: { current: 4567, projected: 4789, growth: '+4.9%' },
        engagement: { current: 78, projected: 80, growth: '+2.6%' }
      },
      probability: 15
    }
  };

  const currentScenario = scenarios?.[selectedScenario];

  const handleInputChange = (key, value) => {
    setCustomInputs(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  const calculateCustomProjections = () => {
    const baseRevenue = 892000;
    const baseUsers = 125000;
    const baseEngagement = 78;

    const revenueMultiplier = 1 + (customInputs?.prizePoolIncrease / 100);
    const userMultiplier = 1 + (customInputs?.userGrowthRate / 100);
    const engagementMultiplier = 1 + (customInputs?.engagementBoost / 100);

    return {
      revenue: Math.round(baseRevenue * revenueMultiplier),
      users: Math.round(baseUsers * userMultiplier),
      engagement: Math.round(baseEngagement * engagementMultiplier)
    };
  };

  const customProjections = calculateCustomProjections();

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="GitBranch" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Scenario Modeling Tools
          </h2>
        </div>

        <div className="flex gap-3 mb-6">
          {Object.keys(scenarios)?.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`flex-1 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                selectedScenario === key
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="font-semibold mb-1">{scenarios?.[key]?.label}</div>
              <div className="text-xs opacity-80">{scenarios?.[key]?.probability}% probability</div>
            </button>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 mb-6">
          <h3 className="text-base font-semibold text-foreground mb-3">{currentScenario?.label}</h3>
          <p className="text-sm text-muted-foreground mb-4">{currentScenario?.description}</p>
          
          <div className="mb-4">
            <div className="text-sm font-medium text-foreground mb-2">Key Assumptions:</div>
            <ul className="space-y-1">
              {currentScenario?.assumptions?.map((assumption, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  {assumption}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(currentScenario?.projections)?.map(([key, data]) => (
              <div key={key} className="bg-white dark:bg-gray-900 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1 capitalize">{key}</div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {key === 'revenue' ? `$${(data?.projected / 1000)?.toFixed(0)}K` : 
                   key === 'users' ? `${(data?.projected / 1000)?.toFixed(0)}K` :
                   key === 'elections' ? data?.projected?.toLocaleString() :
                   `${data?.projected}%`}
                </div>
                <div className={`text-xs font-medium ${
                  parseFloat(data?.growth) > 10 
                    ? 'text-green-600 dark:text-green-400' 
                    : parseFloat(data?.growth) > 5
                    ? 'text-blue-600 dark:text-blue-400' :'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {data?.growth}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Probability of occurrence: <strong>{currentScenario?.probability}%</strong> based on historical data and market analysis
          </span>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Sliders" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Custom Scenario Builder
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Prize Pool Increase (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                value={customInputs?.prizePoolIncrease}
                onChange={(e) => handleInputChange('prizePoolIncrease', e?.target?.value)}
                className="flex-1"
              />
              <span className="text-lg font-bold text-foreground w-16 text-right">
                {customInputs?.prizePoolIncrease}%
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              User Growth Rate (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                value={customInputs?.userGrowthRate}
                onChange={(e) => handleInputChange('userGrowthRate', e?.target?.value)}
                className="flex-1"
              />
              <span className="text-lg font-bold text-foreground w-16 text-right">
                {customInputs?.userGrowthRate}%
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Engagement Boost (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="30"
                value={customInputs?.engagementBoost}
                onChange={(e) => handleInputChange('engagementBoost', e?.target?.value)}
                className="flex-1"
              />
              <span className="text-lg font-bold text-foreground w-16 text-right">
                {customInputs?.engagementBoost}%
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">Custom Scenario Projections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Projected Revenue</div>
                <div className="text-2xl font-bold text-foreground">
                  ${(customProjections?.revenue / 1000)?.toFixed(0)}K
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{((customProjections?.revenue - 892000) / 892000 * 100)?.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Projected Users</div>
                <div className="text-2xl font-bold text-foreground">
                  {(customProjections?.users / 1000)?.toFixed(0)}K
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{((customProjections?.users - 125000) / 125000 * 100)?.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Projected Engagement</div>
                <div className="text-2xl font-bold text-foreground">
                  {customProjections?.engagement}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{((customProjections?.engagement - 78) / 78 * 100)?.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioModelingPanel;