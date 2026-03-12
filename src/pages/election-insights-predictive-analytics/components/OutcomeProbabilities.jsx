import React from 'react';
import Icon from '../../../components/AppIcon';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OutcomeProbabilities = ({ outcomes }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Election Outcome Probabilities</h3>
          <p className="text-sm text-muted-foreground mt-1">Predictive modeling with confidence intervals</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10">
          <Icon name="Brain" size={16} className="text-accent" />
          <span className="text-xs font-medium text-accent">ML Powered</span>
        </div>
      </div>

      <div className="w-full h-80" aria-label="Outcome Probabilities Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={outcomes}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ outcome, probability }) => `${outcome}: ${probability}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="probability"
            >
              {outcomes?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
              formatter={(value, name, props) => [
                `${value}% (Confidence: ${(props?.payload?.confidence * 100)?.toFixed(0)}%)`,
                props?.payload?.outcome
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-3">
        {outcomes?.map((outcome, index) => (
          <div key={index} className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: outcome?.color }}
                />
                <p className="text-sm font-medium text-foreground">{outcome?.outcome}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-heading font-bold text-foreground">{outcome?.probability}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-border rounded-full h-2">
                <div
                  className="rounded-full h-2 transition-all duration-500"
                  style={{
                    width: `${outcome?.probability}%`,
                    backgroundColor: outcome?.color
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {(outcome?.confidence * 100)?.toFixed(0)}% confidence
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Statistical Significance</p>
            <p className="text-xs text-muted-foreground">
              Probabilities calculated using historical voting patterns, demographic trends, and real-time engagement metrics.
              Confidence intervals reflect model certainty based on data quality and sample size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomeProbabilities;