import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';

const ResultsAnalytics = ({ election }) => {
  const mockVotingTrend = [
    { time: '00:00', votes: 0 },
    { time: '04:00', votes: 234 },
    { time: '08:00', votes: 567 },
    { time: '12:00', votes: 1245 },
    { time: '16:00', votes: 2134 },
    { time: '20:00', votes: 3456 },
    { time: '24:00', votes: election?.totalVoters || 4567 }
  ];

  const mockDemographics = [
    { category: '18-24', percentage: 25, count: Math.floor((election?.totalVoters || 0) * 0.25) },
    { category: '25-34', percentage: 35, count: Math.floor((election?.totalVoters || 0) * 0.35) },
    { category: '35-44', percentage: 20, count: Math.floor((election?.totalVoters || 0) * 0.20) },
    { category: '45-54', percentage: 12, count: Math.floor((election?.totalVoters || 0) * 0.12) },
    { category: '55+', percentage: 8, count: Math.floor((election?.totalVoters || 0) * 0.08) }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-democratic-md">
          <p className="text-xs text-muted-foreground mb-1">{payload?.[0]?.payload?.time}</p>
          <p className="text-sm font-semibold text-foreground">
            {payload?.[0]?.value?.toLocaleString()} votes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
          <Icon name="TrendingUp" size={28} className="text-primary" />
          Voting Trends Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockVotingTrend}>
            <defs>
              <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="votes" 
              stroke="var(--color-primary)" 
              fillOpacity={1} 
              fill="url(#colorVotes)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
          <Icon name="Users" size={28} className="text-secondary" />
          Demographic Breakdown
        </h2>
        <div className="space-y-4">
          {mockDemographics?.map((demo, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{demo?.category} years</span>
                <span className="text-sm text-muted-foreground">
                  {demo?.count?.toLocaleString()} voters ({demo?.percentage}%)
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary transition-all duration-500"
                  style={{ width: `${demo?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Vote Time</p>
              <p className="text-lg font-data font-bold text-foreground">2.3 min</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peak Hour</p>
              <p className="text-lg font-data font-bold text-foreground">8:00 PM</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Percent" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
              <p className="text-lg font-data font-bold text-foreground">94.7%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalytics;