import React from 'react';
import Icon from '../../../components/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const VotingTrendsForecast = ({ trends, timeRange }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Voting Trends Forecast</h3>
          <p className="text-sm text-muted-foreground mt-1">Historical data and predictive modeling for {timeRange}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
          <Icon name="TrendingUp" size={16} className="text-primary" />
          <span className="text-xs font-medium text-primary">Predictive Model Active</span>
        </div>
      </div>

      <div className="w-full h-96" aria-label="Voting Trends Forecast Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trends}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              stroke="var(--color-muted-foreground)"
              tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
              labelFormatter={(value) => new Date(value)?.toLocaleDateString()}
              formatter={(value, name) => [
                value ? value?.toLocaleString() : 'N/A',
                name === 'actual' ? 'Actual Votes' : 'Predicted Votes'
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#2563EB"
              strokeWidth={2}
              fill="url(#colorActual)"
              name="Actual Votes"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#7C3AED"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#colorPredicted)"
              name="Predicted Votes"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-primary" />
            <p className="text-sm font-medium text-foreground">Growth Trajectory</p>
          </div>
          <p className="text-2xl font-heading font-bold text-primary">+23.5%</p>
          <p className="text-xs text-muted-foreground mt-1">Projected increase over {timeRange}</p>
        </div>
        <div className="p-4 rounded-lg bg-success/5 border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={18} className="text-success" />
            <p className="text-sm font-medium text-foreground">Forecast Confidence</p>
          </div>
          <p className="text-2xl font-heading font-bold text-success">
            {trends?.[trends?.length - 1]?.confidence ? (trends?.[trends?.length - 1]?.confidence * 100)?.toFixed(0) : 0}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Model confidence level</p>
        </div>
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={18} className="text-accent" />
            <p className="text-sm font-medium text-foreground">Peak Prediction</p>
          </div>
          <p className="text-2xl font-heading font-bold text-accent">
            {Math.max(...(trends?.map(t => t?.predicted) || [0]))?.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Expected peak votes</p>
        </div>
      </div>
    </div>
  );
};

export default VotingTrendsForecast;