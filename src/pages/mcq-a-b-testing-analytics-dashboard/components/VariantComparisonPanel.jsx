import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const VariantComparisonPanel = ({ testData }) => {
  if (!testData) return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <p className="text-gray-500 text-center py-8">Select a test to view comparison</p>
    </div>
  );

  const { variantA, variantB } = testData;

  const chartData = [
    { metric: 'Accuracy', A: parseFloat(variantA?.accuracy?.toFixed(1) || 0), B: parseFloat(variantB?.accuracy?.toFixed(1) || 0) },
    { metric: 'Responses', A: variantA?.responses || 0, B: variantB?.responses || 0 },
  ];

  const metrics = [
    { label: 'Total Responses', iconComp: Users, aVal: variantA?.responses || 0, bVal: variantB?.responses || 0, unit: '' },
    { label: 'Accuracy Rate', iconComp: Target, aVal: parseFloat(variantA?.accuracy?.toFixed(1) || 0), bVal: parseFloat(variantB?.accuracy?.toFixed(1) || 0), unit: '%' },
    { label: 'Avg Response Time', iconComp: Clock, aVal: Math.round(variantA?.avgResponseTime || 0), bVal: Math.round(variantB?.avgResponseTime || 0), unit: 'ms' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <TrendingUp size={20} className="text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Side-by-Side Comparison</h3>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-3 mb-5">
        {metrics?.map((m, i) => {
          const Icon = m?.iconComp;
          const aWins = m?.aVal > m?.bVal;
          const bWins = m?.bVal > m?.aVal;
          return (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Icon size={16} className="text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">{m?.label}</span>
              <div className="flex items-center gap-3">
                <div className={`text-center px-3 py-1 rounded-lg ${
                  aWins ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <p className="text-xs text-gray-400">A</p>
                  <p className={`text-sm font-bold ${aWins ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}`}>
                    {m?.aVal}{m?.unit}
                  </p>
                </div>
                <span className="text-xs text-gray-400">vs</span>
                <div className={`text-center px-3 py-1 rounded-lg ${
                  bWins ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <p className="text-xs text-gray-400">B</p>
                  <p className={`text-sm font-bold ${bWins ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}`}>
                    {m?.bVal}{m?.unit}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="A" name="Variant A" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="B" name="Variant B" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VariantComparisonPanel;
