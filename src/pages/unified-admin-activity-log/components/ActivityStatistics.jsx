import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityStatistics = ({ statistics, logs }) => {
  const COLORS = ['#2563EB', '#7C3AED', '#F59E0B', '#059669', '#DC2626', '#EC4899', '#14B8A6', '#F97316'];

  const actionTypeData = Object.entries(statistics?.byActionType || {})?.map(([type, count]) => ({
    name: type?.replace(/_/g, ' '),
    value: count
  }));

  const severityData = Object.entries(statistics?.bySeverity || {})?.map(([severity, count]) => ({
    name: severity,
    value: count
  }));

  const overviewCards = [
    {
      label: 'Total Activities',
      value: statistics?.total || 0,
      icon: 'Activity',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Today',
      value: statistics?.today || 0,
      icon: 'Calendar',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'This Week',
      value: statistics?.thisWeek || 0,
      icon: 'CalendarDays',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Compliance Relevant',
      value: statistics?.complianceRelevant || 0,
      icon: 'Shield',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards?.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card?.bgColor}`}>
                <Icon name={card?.icon} size={24} className={card?.color} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card?.label}</p>
                <p className="text-2xl font-heading font-bold text-foreground font-data">{card?.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Activities by Action Type</h3>
          <div className="w-full h-80" aria-label="Action Type Distribution Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-muted-foreground)" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#2563EB" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Activities by Severity</h3>
          <div className="w-full h-80" aria-label="Severity Distribution Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData?.map((entry, index) => (
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
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Action Type Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(statistics?.byActionType || {})?.map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm font-medium text-foreground capitalize">
                  {type?.replace(/_/g, ' ')}
                </span>
              </div>
              <span className="text-sm font-bold text-foreground font-data">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Audit Trail Integrity</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              All administrative actions are logged with tamper-evident timestamps and digital signatures for compliance and security auditing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStatistics;