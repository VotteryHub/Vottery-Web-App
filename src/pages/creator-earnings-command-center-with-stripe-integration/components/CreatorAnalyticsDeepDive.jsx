import React, { useState, useEffect } from 'react';
import { Users, MapPin, TrendingUp, BarChart3, Clock, Target } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { creatorEarningsService } from '../../../services/creatorEarningsService';
import toast from 'react-hot-toast';

const CreatorAnalyticsDeepDive = ({ creatorId }) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [activeSection, setActiveSection] = useState('demographics');

  useEffect(() => {
    loadAnalytics();
  }, [creatorId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const result = await creatorEarningsService?.getComprehensiveAnalytics(creatorId);
      if (result?.data) {
        setAnalytics(result?.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast?.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex gap-4 overflow-x-auto">
          {[
            { id: 'demographics', label: 'Audience Demographics', icon: Users },
            { id: 'engagement', label: 'Engagement Patterns', icon: TrendingUp },
            { id: 'revenue', label: 'Revenue Attribution', icon: BarChart3 },
            { id: 'channels', label: 'Multi-Channel Performance', icon: Target }
          ]?.map((section) => {
            const SectionIcon = section?.icon;
            return (
              <button
                key={section?.id}
                onClick={() => setActiveSection(section?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeSection === section?.id
                    ? 'bg-blue-600 text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <SectionIcon size={18} />
                {section?.label}
              </button>
            );
          })}
        </div>
      </div>
      {/* Content Sections */}
      {activeSection === 'demographics' && (
        <AudienceDemographics data={analytics?.audienceDemographics} />
      )}
      {activeSection === 'engagement' && (
        <EngagementPatterns data={analytics?.engagementPatterns} />
      )}
      {activeSection === 'revenue' && (
        <RevenueAttribution data={analytics?.revenueByContentType} />
      )}
      {activeSection === 'channels' && (
        <MultiChannelPerformance data={analytics?.channelPerformance} />
      )}
    </div>
  );
};

// Audience Demographics Component
const AudienceDemographics = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Age Groups */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon icon={Users} className="w-5 h-5 text-blue-600" />
          Age Distribution
        </h3>
        <div className="space-y-3">
          {data?.ageGroups?.map((group) => {
            const total = data?.ageGroups?.reduce((sum, g) => sum + g?.count, 0);
            const percentage = total > 0 ? (group?.count / total) * 100 : 0;
            return (
              <div key={group?.range}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{group?.range}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {group?.count} ({percentage?.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Gender Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.genderDistribution?.map((item) => {
            const total = data?.genderDistribution?.reduce((sum, g) => sum + g?.count, 0);
            const percentage = total > 0 ? (item?.count / total) * 100 : 0;
            return (
              <div key={item?.gender} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{percentage?.toFixed(1)}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{item?.gender}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item?.count} users</p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Top Locations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon icon={MapPin} className="w-5 h-5 text-green-600" />
          Top Locations
        </h3>
        <div className="space-y-3">
          {data?.locations?.slice(0, 10)?.map((location, index) => {
            const total = data?.locations?.reduce((sum, l) => sum + l?.count, 0);
            const percentage = total > 0 ? (location?.count / total) * 100 : 0;
            return (
              <div key={location?.country} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{location?.country}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {location?.count} ({percentage?.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Engagement Patterns Component
const EngagementPatterns = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Hourly Pattern */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon icon={Clock} className="w-5 h-5 text-purple-600" />
          Hourly Engagement Pattern
        </h3>
        <div className="grid grid-cols-12 gap-2">
          {data?.hourlyPattern?.map((item) => {
            const maxCount = Math.max(...(data?.hourlyPattern?.map(h => h?.count) || [1]));
            const height = maxCount > 0 ? (item?.count / maxCount) * 100 : 0;
            return (
              <div key={item?.hour} className="flex flex-col items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t" style={{ height: '100px', position: 'relative' }}>
                  <div
                    className="absolute bottom-0 w-full bg-purple-600 rounded-t transition-all"
                    style={{ height: `${height}%` }}
                    title={`${item?.hour}:00 - ${item?.count} engagements`}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item?.hour}</span>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          Peak engagement: {data?.hourlyPattern?.reduce((max, item) => item?.count > max?.count ? item : max, { hour: 0, count: 0 })?.hour}:00
        </p>
      </div>
      {/* Weekly Pattern */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Engagement Pattern</h3>
        <div className="space-y-3">
          {data?.weeklyPattern?.map((item) => {
            const maxCount = Math.max(...(data?.weeklyPattern?.map(d => d?.count) || [1]));
            const percentage = maxCount > 0 ? (item?.count / maxCount) * 100 : 0;
            return (
              <div key={item?.day}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item?.day}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item?.count} engagements</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Engagement Types */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.engagementTypes?.map((type) => {
            const total = data?.engagementTypes?.reduce((sum, t) => sum + t?.count, 0);
            const percentage = total > 0 ? (type?.count / total) * 100 : 0;
            return (
              <div key={type?.type} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{type?.count?.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{type?.type}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{percentage?.toFixed(1)}% of total</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Revenue Attribution Component
const RevenueAttribution = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon icon={BarChart3} className="w-5 h-5 text-green-600" />
          Revenue by Content Type
        </h3>
        <div className="space-y-4">
          {data?.map((item) => (
            <div key={item?.contentType} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{item?.contentType}</h4>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${item?.totalRevenue?.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Elections</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{item?.electionCount}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Avg Revenue/Election</p>
                  <p className="font-semibold text-gray-900 dark:text-white">${item?.avgRevenuePerElection?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Insights */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Revenue Insights</h4>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
            <span>
              <strong>Top Performer:</strong> {data?.[0]?.contentType} generating ${data?.[0]?.totalRevenue?.toLocaleString()}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
            <span>
              <strong>Best ROI:</strong> {data?.reduce((best, item) => 
                item?.avgRevenuePerElection > (best?.avgRevenuePerElection || 0) ? item : best, 
                {}
              )?.contentType} with ${data?.reduce((best, item) => 
                item?.avgRevenuePerElection > (best?.avgRevenuePerElection || 0) ? item : best, 
                {}
              )?.avgRevenuePerElection?.toFixed(2)}/election
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Multi-Channel Performance Component
const MultiChannelPerformance = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon icon={Target} className="w-5 h-5 text-blue-600" />
          Channel Performance Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.map((channel) => (
            <div key={channel?.name} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{channel?.value?.toLocaleString()}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">{channel?.metric}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{channel?.name}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Performance Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Performance Summary</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Engagement Rate</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {data?.length > 0 && data?.[1]?.value > 0 
                ? ((data?.[2]?.value / data?.[1]?.value) * 100)?.toFixed(2)
                : 0
              }%
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Avg Engagement per Election</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {data?.length > 0 && data?.[0]?.value > 0
                ? ((data?.[1]?.value + data?.[2]?.value + data?.[3]?.value) / data?.[0]?.value)?.toFixed(1)
                : 0
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorAnalyticsDeepDive;