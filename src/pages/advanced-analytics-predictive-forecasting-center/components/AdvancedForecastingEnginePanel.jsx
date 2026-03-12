import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AdvancedForecastingEnginePanel = ({ data, timeframe }) => {
  const [selectedModel, setSelectedModel] = useState('behavior');

  const userBehaviorPredictions = [
    { segment: 'Power Voters', currentActivity: 85, predictedActivity: 92, churnRisk: 8 },
    { segment: 'Casual Participants', currentActivity: 45, predictedActivity: 58, churnRisk: 22 },
    { segment: 'New Users', currentActivity: 62, predictedActivity: 71, churnRisk: 35 },
    { segment: 'Dormant Users', currentActivity: 12, predictedActivity: 28, churnRisk: 68 },
    { segment: 'High Spenders', currentActivity: 78, predictedActivity: 84, churnRisk: 12 }
  ];

  const electionSuccessProbability = [
    { category: 'Entertainment', successRate: 78, participationForecast: 2450, revenueProjection: 12500 },
    { category: 'Sports', successRate: 85, participationForecast: 3200, revenueProjection: 18900 },
    { category: 'Politics', successRate: 72, participationForecast: 1890, revenueProjection: 9800 },
    { category: 'Technology', successRate: 68, participationForecast: 1650, revenueProjection: 8200 },
    { category: 'Lifestyle', successRate: 81, participationForecast: 2890, revenueProjection: 15600 }
  ];

  const platformGrowthProjections = [
    { month: 'Current', users: 125000, elections: 4500, revenue: 450000 },
    { month: 'Month 1', users: 138000, elections: 5200, revenue: 520000 },
    { month: 'Month 2', users: 152000, elections: 5900, revenue: 598000 },
    { month: 'Month 3', users: 167000, elections: 6700, revenue: 685000 }
  ];

  const mlModelPerformance = [
    { model: 'User Behavior', accuracy: 92, precision: 89, recall: 91, f1Score: 90 },
    { model: 'Election Success', accuracy: 88, precision: 85, recall: 87, f1Score: 86 },
    { model: 'Revenue Forecast', accuracy: 85, precision: 83, recall: 84, f1Score: 83.5 },
    { model: 'Churn Prediction', accuracy: 90, precision: 88, recall: 89, f1Score: 88.5 },
    { model: 'Engagement Trends', accuracy: 87, precision: 85, recall: 86, f1Score: 85.5 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Icon name="Brain" size={24} className="text-primary" />
              Machine Learning Forecasting Engine
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced algorithms for user behavior prediction and election success probability modeling
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedModel('behavior')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedModel === 'behavior' ?'bg-primary text-white' :'bg-gray-100 dark:bg-gray-800 text-foreground'
              }`}
            >
              User Behavior
            </button>
            <button
              onClick={() => setSelectedModel('success')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedModel === 'success' ?'bg-primary text-white' :'bg-gray-100 dark:bg-gray-800 text-foreground'
              }`}
            >
              Election Success
            </button>
            <button
              onClick={() => setSelectedModel('growth')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedModel === 'growth' ?'bg-primary text-white' :'bg-gray-100 dark:bg-gray-800 text-foreground'
              }`}
            >
              Platform Growth
            </button>
          </div>
        </div>

        {selectedModel === 'behavior' && (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userBehaviorPredictions}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="segment" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="currentActivity" fill="#3b82f6" name="Current Activity %" />
                <Bar dataKey="predictedActivity" fill="#10b981" name="Predicted Activity %" />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {userBehaviorPredictions?.map((segment, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm font-medium text-foreground mb-2">{segment?.segment}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="TrendingUp" size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-lg font-bold text-foreground">
                      +{segment?.predictedActivity - segment?.currentActivity}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="AlertTriangle" size={14} className="text-orange-600 dark:text-orange-400" />
                    <span className="text-xs text-muted-foreground">
                      {segment?.churnRisk}% churn risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedModel === 'success' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={electionSuccessProbability}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="successRate" fill="#8b5cf6" name="Success Rate %" />
                </BarChart>
              </ResponsiveContainer>

              <div className="space-y-3">
                {electionSuccessProbability?.map((cat, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{cat?.category}</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {cat?.successRate}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Participation:</span>
                        <span className="font-medium text-foreground ml-1">{cat?.participationForecast?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className="font-medium text-foreground ml-1">${cat?.revenueProjection?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedModel === 'growth' && (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={platformGrowthProjections}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Total Users" />
                <Line type="monotone" dataKey="elections" stroke="#10b981" strokeWidth={2} name="Active Elections" />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {platformGrowthProjections?.map((proj, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-3">{proj?.month}</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Users</div>
                      <div className="text-lg font-bold text-foreground">{proj?.users?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Elections</div>
                      <div className="text-lg font-bold text-foreground">{proj?.elections?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                      <div className="text-lg font-bold text-foreground">${(proj?.revenue / 1000)?.toFixed(0)}K</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Activity" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            ML Model Performance & Statistical Significance
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={mlModelPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="model" className="text-xs" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Accuracy" dataKey="accuracy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Radar name="F1 Score" dataKey="f1Score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {mlModelPerformance?.map((model, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">{model?.model}</span>
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {model?.accuracy}% Accurate
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Precision:</span>
                    <span className="font-medium text-foreground ml-1">{model?.precision}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Recall:</span>
                    <span className="font-medium text-foreground ml-1">{model?.recall}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">F1:</span>
                    <span className="font-medium text-foreground ml-1">{model?.f1Score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedForecastingEnginePanel;