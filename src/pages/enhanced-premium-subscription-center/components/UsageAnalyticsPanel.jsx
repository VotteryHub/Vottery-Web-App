import React, { useState } from 'react';


const MEMBER_USAGE = [
  { name: 'Alex J.', role: 'primary', elections: 45, votes: 128, quests: 23, vpEarned: 4200, engagementScore: 92, costShare: 13.50 },
  { name: 'Sam J.', role: 'secondary', elections: 32, votes: 89, quests: 15, vpEarned: 2800, engagementScore: 74, costShare: 9.00 },
  { name: 'Jordan J.', role: 'child', elections: 18, votes: 42, quests: 8, vpEarned: 1200, engagementScore: 55, costShare: 4.50 },
  { name: 'Casey J.', role: 'child', elections: 12, votes: 28, quests: 5, vpEarned: 800, engagementScore: 38, costShare: 3.00 },
];

const FEATURE_USAGE = [
  { feature: 'Voting', usage: 87 }, { feature: 'Quests', usage: 62 },
  { feature: 'AI Features', usage: 45 }, { feature: 'Analytics', usage: 38 },
  { feature: 'Social', usage: 71 }, { feature: 'Wallet', usage: 55 },
];

const UsageAnalyticsPanel = ({ subscriptionData }) => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Period:</span>
        {['7d', '30d', '90d']?.map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
      {/* Per-Member Usage Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Member Usage Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Member</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Elections</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Votes</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Quests</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">VP Earned</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Engagement</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Cost Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MEMBER_USAGE?.map((member) => (
                <tr key={member?.name} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{member?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member?.role}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-foreground">{member?.elections}</td>
                  <td className="px-4 py-4 text-center text-sm text-foreground">{member?.votes}</td>
                  <td className="px-4 py-4 text-center text-sm text-foreground">{member?.quests}</td>
                  <td className="px-4 py-4 text-center text-sm font-medium text-purple-500">{member?.vpEarned?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            member?.engagementScore >= 80 ? 'bg-green-500' :
                            member?.engagementScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${member?.engagementScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-foreground">{member?.engagementScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-medium text-foreground">${member?.costShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Feature Utilization */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Feature Utilization</h3>
        <div className="space-y-3">
          {FEATURE_USAGE?.map((item) => (
            <div key={item?.feature} className="flex items-center gap-4">
              <span className="text-sm text-foreground w-24 flex-shrink-0">{item?.feature}</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item?.usage >= 70 ? 'bg-green-500' : item?.usage >= 40 ? 'bg-blue-500' : 'bg-muted-foreground'
                  }`}
                  style={{ width: `${item?.usage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground w-10 text-right">{item?.usage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsageAnalyticsPanel;
