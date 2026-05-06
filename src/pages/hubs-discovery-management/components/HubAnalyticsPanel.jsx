import React, { useState, useEffect } from 'react';
import { BarChart2, Users, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const HubAnalyticsPanel = ({ groupId }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics({
      totalMembers: 1247,
      activeMembers: 342,
      postsThisWeek: 89,
      engagementRate: 27.4,
      growthRate: 12.3,
      topContributors: [
        { name: 'Alice Johnson', posts: 23, engagement: 94 },
        { name: 'Bob Smith', posts: 18, engagement: 87 },
        { name: 'Carol White', posts: 15, engagement: 82 },
      ],
      weeklyActivity: [
        { day: 'Mon', posts: 12, members: 45 },
        { day: 'Tue', posts: 18, members: 62 },
        { day: 'Wed', posts: 15, members: 58 },
        { day: 'Thu', posts: 22, members: 71 },
        { day: 'Fri', posts: 19, members: 65 },
        { day: 'Sat', posts: 8, members: 32 },
        { day: 'Sun', posts: 6, members: 28 },
      ]
    });
  }, [groupId]);

  if (!analytics) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-900 dark:text-white">Hub Analytics</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Members', value: analytics?.totalMembers?.toLocaleString(), icon: Users, color: 'text-blue-600' },
          { label: 'Active Members', value: analytics?.activeMembers?.toLocaleString(), icon: Activity, color: 'text-green-600' },
          { label: 'Posts This Week', value: analytics?.postsThisWeek, icon: TrendingUp, color: 'text-purple-600' },
          { label: 'Engagement Rate', value: `${analytics?.engagementRate}%`, icon: BarChart2, color: 'text-amber-600' },
        ]?.map((stat, i) => (
          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <stat.icon className={`w-4 h-4 ${stat?.color} mb-1`} />
            <p className={`text-xl font-bold ${stat?.color}`}>{stat?.value}</p>
            <p className="text-xs text-gray-500">{stat?.label}</p>
          </div>
        ))}
      </div>
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics?.weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="posts" fill="#3b82f6" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Top Contributors</h4>
        <div className="space-y-2">
          {analytics?.topContributors?.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{c?.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{c?.posts} posts</span>
                <span className="text-xs font-bold text-blue-600">{c?.engagement}% eng.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HubAnalyticsPanel;
