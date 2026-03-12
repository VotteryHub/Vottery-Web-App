import React from 'react';
import Icon from '../../../components/AppIcon';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CostAnalysis = ({ data }) => {
  const budgetData = [
    { name: 'Zone 1-2', value: 25000, color: '#2563EB' },
    { name: 'Zone 3-4', value: 32000, color: '#7C3AED' },
    { name: 'Zone 5-6', value: 28000, color: '#059669' },
    { name: 'Zone 7-8', value: 22000, color: '#F59E0B' }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Cost Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Detailed cost breakdown and optimization insights
          </p>
        </div>
        <Icon name="DollarSign" size={24} className="text-accent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Cost/Participant</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.costPerParticipant || 0}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Percent" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Budget Utilization</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.budgetUtilization || 0}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingDown" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Cost Savings</span>
          </div>
          <p className="text-2xl font-heading font-bold text-success font-data">
            ${data?.costSavings?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Budget Distribution by Zone
        </h3>
        <div className="w-full h-64" aria-label="Budget Distribution Chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-accent/10">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} className="text-accent mt-1" />
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-2">
              Optimization Recommendations
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Increase budget allocation to Zone 3-4 for 15% better ROI</li>
              <li>• Reduce spending in Zone 8 by 20% to optimize cost efficiency</li>
              <li>• Consider A/B testing in Zone 5-6 for improved conversion rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysis;