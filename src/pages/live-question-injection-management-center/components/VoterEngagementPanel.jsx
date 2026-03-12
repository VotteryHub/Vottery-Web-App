import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VoterEngagementPanel = ({ analytics = [], loading }) => {
  const totalResponses = analytics?.reduce((sum, a) => sum + (a?.totalResponses || a?.total_responses || 0), 0);
  const avgResponseRate = analytics?.length > 0
    ? analytics?.reduce((sum, a) => sum + (a?.responseRate || a?.response_rate || 0), 0) / analytics?.length
    : 0;

  const chartData = analytics?.slice(0, 8)?.map((a, idx) => ({
    name: `Q${idx + 1}`,
    responses: a?.totalResponses || a?.total_responses || 0,
    rate: Math.round((a?.responseRate || a?.response_rate || 0) * 100)
  }));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
          <Icon name="Users" size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Voter Engagement</h3>
          <p className="text-xs text-muted-foreground">Real-time response analytics</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Responses</p>
          <p className="text-2xl font-bold text-purple-600">{totalResponses}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Avg Response Rate</p>
          <p className="text-2xl font-bold text-blue-600">{Math.round(avgResponseRate * 100)}%</p>
        </div>
      </div>

      {/* Animated Banner Preview */}
      <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
            <Icon name="Bell" size={16} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">🎉 New question added!</p>
            <p className="text-xs text-white/80">Voters see this animated banner notification</p>
          </div>
        </div>
      </div>

      {/* Response Chart */}
      {chartData?.length > 0 ? (
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Response Rates by Question</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="responses" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-6">
          <Icon name="BarChart2" size={36} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-muted-foreground">No engagement data yet</p>
          <p className="text-xs text-muted-foreground">Broadcast questions to see analytics</p>
        </div>
      )}
    </div>
  );
};

export default VoterEngagementPanel;
