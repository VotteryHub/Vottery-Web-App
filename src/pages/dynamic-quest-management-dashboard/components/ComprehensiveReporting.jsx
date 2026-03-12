import React from 'react';
import { BarChart3, Download, FileText, TrendingUp, Award } from 'lucide-react';

const ComprehensiveReporting = ({ activeQuests, completedQuests, stats, userId }) => {
  const generateReport = () => {
    const report = {
      userId,
      generatedAt: new Date()?.toISOString(),
      summary: {
        totalQuests: stats?.totalQuests || 0,
        activeQuests: stats?.activeQuests || 0,
        completedQuests: stats?.completedQuests || 0,
        completionRate: stats?.completionRate || 0,
        totalVPEarned: stats?.totalVPEarned || 0
      },
      activeQuests: activeQuests?.map(q => ({
        id: q?.id,
        title: q?.title,
        progress: `${q?.current_progress}/${q?.target_value}`,
        vpReward: q?.vp_reward
      })),
      completedQuests: completedQuests?.slice(0, 10)?.map(q => ({
        id: q?.id,
        title: q?.title,
        completedAt: q?.completed_at,
        vpEarned: q?.vp_reward
      }))
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quest-report-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    link?.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-green-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-600" />
          Comprehensive Reporting
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Strategic quest optimization and user engagement enhancement analytics
        </p>
      </div>

      {/* Report Summary */}
      <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Quest Performance Summary
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Total Quests</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats?.totalQuests || 0}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Active Quests</span>
              <span className="font-bold text-blue-600">{stats?.activeQuests || 0}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Completed Quests</span>
              <span className="font-bold text-green-600">{stats?.completedQuests || 0}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
              <span className="font-bold text-purple-600">{stats?.completionRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Total VP Earned</span>
              <span className="font-bold text-yellow-600">{stats?.totalVPEarned || 0} VP</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Avg VP/Quest</span>
              <span className="font-bold text-orange-600">
                {stats?.completedQuests > 0 ? Math.round(stats?.totalVPEarned / stats?.completedQuests) : 0} VP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-green-600" />
          Export Reports
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={generateReport}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all"
          >
            <Download className="w-5 h-5" />
            Download JSON Report
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
            <FileText className="w-5 h-5" />
            Generate PDF Report
          </button>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-600">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Strategic Insights
        </h4>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p className="flex items-start gap-2">
            <Award className="w-5 h-5 text-purple-600 mt-0.5" />
            <span>
              <strong>Engagement Level:</strong> {stats?.completionRate >= 70 ? 'High' : stats?.completionRate >= 50 ? 'Medium' : 'Low'} - 
              {stats?.completionRate >= 70 ? ' Users are highly engaged with quest system' : ' Consider adjusting quest difficulty or rewards'}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <Award className="w-5 h-5 text-blue-600 mt-0.5" />
            <span>
              <strong>VP Distribution:</strong> Average {stats?.completedQuests > 0 ? Math.round(stats?.totalVPEarned / stats?.completedQuests) : 0} VP per quest - 
              {stats?.completedQuests > 0 && Math.round(stats?.totalVPEarned / stats?.completedQuests) > 200 ? ' High reward quests driving engagement' : ' Consider increasing rewards for better motivation'}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <Award className="w-5 h-5 text-green-600 mt-0.5" />
            <span>
              <strong>Active Participation:</strong> {stats?.activeQuests || 0} quests in progress - 
              {stats?.activeQuests > 5 ? ' Strong ongoing engagement' : ' Opportunity to generate more personalized quests'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveReporting;
