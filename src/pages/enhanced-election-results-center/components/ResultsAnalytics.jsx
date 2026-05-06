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

      {/* Visual Sentiment Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <Icon name="Heart" size={20} className="text-red-500" />
            Voter Sentiment Map
          </h3>
          <div className="space-y-6">
            {[
              { region: 'Lagos, Nigeria', sentiment: 82, trend: 'up' },
              { region: 'Accra, Ghana', sentiment: 74, trend: 'down' },
              { region: 'Nairobi, Kenya', sentiment: 91, trend: 'up' },
              { region: 'Johannesburg, SA', sentiment: 68, trend: 'neutral' }
            ].map((r, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">{r.region}</span>
                  <span className={`text-xs font-black ${r.sentiment > 80 ? 'text-green-500' : r.sentiment > 70 ? 'text-primary' : 'text-amber-500'}`}>
                    {r.sentiment}% POSITIVE
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${r.sentiment > 80 ? 'bg-green-500' : r.sentiment > 70 ? 'bg-primary' : 'bg-amber-500'}`} 
                    style={{ width: `${r.sentiment}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <Icon name="Map" size={20} className="text-indigo-400" />
            Regional Participation
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Urban Areas', val: '64%', color: 'text-primary' },
              { label: 'Rural Areas', val: '36%', color: 'text-indigo-400' },
              { label: 'Verified ID', val: '98%', color: 'text-green-500' },
              { label: 'Standard ID', val: '2%', color: 'text-muted-foreground' }
            ].map((stat, i) => (
              <div key={i} className="bg-muted/30 border border-border p-4 rounded-xl">
                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
             <Icon name="Info" size={16} className="text-primary mt-0.5" />
             <p className="text-[10px] text-muted-foreground leading-relaxed">
               Regional participation is calculated based on <span className="text-foreground font-bold">Sovereign Identity</span> geolocation pings. All data is anonymized to protect voter privacy.
             </p>
          </div>
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