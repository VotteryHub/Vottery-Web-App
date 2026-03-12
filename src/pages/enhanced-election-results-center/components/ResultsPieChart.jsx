import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Icon from '../../../components/AppIcon';

const ResultsPieChart = ({ election }) => {
  const options = election?.electionOptions || [];
  const totalVotes = options?.reduce((sum, opt) => sum + (opt?.voteCount || 0), 0) || 1;

  const chartData = options?.map((option, index) => ({
    name: option?.title,
    value: option?.voteCount || 0,
    percentage: ((option?.voteCount || 0) / totalVotes * 100)?.toFixed(1),
    color: getColor(index)
  }))?.sort((a, b) => b?.value - a?.value);

  function getColor(index) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
    ];
    return colors?.[index % colors?.length];
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-democratic-md">
          <p className="text-sm font-medium text-foreground mb-1">{data?.name}</p>
          <p className="text-xs text-muted-foreground">
            {data?.value?.toLocaleString()} votes ({data?.payload?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Icon name="PieChart" size={28} className="text-primary" />
            Vote Distribution
          </h2>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Votes</p>
            <p className="text-2xl font-data font-bold text-foreground">{totalVotes?.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {chartData?.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: item?.color }}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{item?.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item?.percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${item?.percentage}%`,
                        backgroundColor: item?.color
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-data font-semibold text-foreground">{item?.value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart" size={24} className="text-secondary" />
          Vote Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="var(--color-primary)">
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsPieChart;