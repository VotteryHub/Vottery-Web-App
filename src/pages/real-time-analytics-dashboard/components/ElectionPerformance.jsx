import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../../services/analyticsService';

const ElectionPerformance = ({ data, timeRange }) => {
  const [electionTypes, setElectionTypes] = useState([]);
  const COLORS = ['#2563EB', '#7C3AED', '#F59E0B', '#059669', '#DC2626'];

  useEffect(() => {
    loadElectionTypes();
  }, [timeRange]);

  const loadElectionTypes = async () => {
    const result = await analyticsService?.getElectionTypeDistribution(timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30);
    if (result?.data) {
      setElectionTypes(result?.data);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Election Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Voting participation rates and blockchain transaction volumes
          </p>
        </div>
        <Icon name="Vote" size={24} className="text-secondary" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="BarChart3" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Total Elections</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.totalElections || '0'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Active Now</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.activeElections || '0'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.completedElections || '0'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Percent" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Participation</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.participationRate || '0'}%
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Election Type Distribution
          </h3>
          <div className="w-full h-64" aria-label="Election Types Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={electionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {electionTypes?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Blockchain Verification Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
              <div className="flex items-center gap-3">
                <Icon name="ShieldCheck" size={24} className="text-success" />
                <div>
                  <p className="font-medium text-foreground">Verified Votes</p>
                  <p className="text-sm text-muted-foreground">On blockchain</p>
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {data?.verifiedVotes?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
              <div className="flex items-center gap-3">
                <Icon name="Vote" size={24} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Total Votes</p>
                  <p className="text-sm text-muted-foreground">All elections</p>
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {data?.totalVotes?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
              <div className="flex items-center gap-3">
                <Icon name="Zap" size={24} className="text-accent" />
                <div>
                  <p className="font-medium text-foreground">Verification Rate</p>
                  <p className="text-sm text-muted-foreground">Success percentage</p>
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {data?.totalVotes > 0 ? ((data?.verifiedVotes / data?.totalVotes) * 100)?.toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionPerformance;
