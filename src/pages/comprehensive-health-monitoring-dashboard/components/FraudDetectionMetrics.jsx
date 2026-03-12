import React from 'react';
import Icon from '../../../components/AppIcon';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const FraudDetectionMetrics = ({ fraudDetection }) => {
  const accuracyData = [
    { name: 'True Positives', value: fraudDetection?.threatsDetected, color: '#10b981' },
    { name: 'False Positives', value: Math.round((fraudDetection?.falsePositiveRate / 100) * fraudDetection?.threatsDetected), color: '#f59e0b' }
  ];

  const metrics = [
    { label: 'Detection Accuracy', value: `${fraudDetection?.accuracy}%`, icon: 'Target', status: 'healthy' },
    { label: 'False Positive Rate', value: `${fraudDetection?.falsePositiveRate}%`, icon: 'AlertTriangle', status: 'healthy' },
    { label: 'Processing Queue', value: fraudDetection?.processingQueue, icon: 'Clock', status: 'healthy' },
    { label: 'Pattern Recognition', value: `${fraudDetection?.patternRecognition}%`, icon: 'Brain', status: 'healthy' },
    { label: 'Threats Detected', value: fraudDetection?.threatsDetected, icon: 'ShieldAlert', status: 'warning' },
    { label: 'Threats Blocked', value: fraudDetection?.threatsBlocked, icon: 'ShieldCheck', status: 'healthy' }
  ];

  const recentThreats = [
    { type: 'Vote Manipulation', severity: 'high', status: 'blocked', time: '2 min ago' },
    { type: 'Suspicious IP Pattern', severity: 'medium', status: 'investigating', time: '15 min ago' },
    { type: 'Multiple Account Creation', severity: 'high', status: 'blocked', time: '1 hour ago' },
    { type: 'Bot Activity Detected', severity: 'medium', status: 'blocked', time: '2 hours ago' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'critical': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Fraud Detection Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(metric?.status)}`}>
                <Icon name={metric?.icon} size={20} className={getStatusColor(metric?.status)?.split(' ')?.[0]} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(metric?.status)}`}>
                {metric?.status}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
            <div className="text-sm text-muted-foreground">{metric?.label}</div>
          </div>
        ))}
      </div>

      {/* Detection Accuracy Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="PieChart" size={20} className="text-primary" />
            Detection Accuracy
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={accuracyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {accuracyData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Scoring */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Confidence Scoring</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">High Confidence (90-100%)</span>
                <span className="text-sm font-semibold text-green-500">78%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Medium Confidence (70-89%)</span>
                <span className="text-sm font-semibold text-yellow-500">18%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Low Confidence (&lt;70%)</span>
                <span className="text-sm font-semibold text-red-500">4%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Threats */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="ShieldAlert" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Threat Activity</h3>
        </div>
        <div className="space-y-3">
          {recentThreats?.map((threat, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Icon name="AlertTriangle" size={18} className="text-red-500" />
                  <span className="font-medium text-foreground">{threat?.type}</span>
                </div>
                <span className="text-xs text-muted-foreground">{threat?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityColor(threat?.severity)}`}>
                  {threat?.severity}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                  threat?.status === 'blocked' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {threat?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionMetrics;