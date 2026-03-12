import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, Target, CheckCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { claudeCreatorSuccessService } from '../../../services/claudeCreatorSuccessService';

const MilestoneTrackingPanel = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      const result = await claudeCreatorSuccessService?.getMilestoneAchievements();
      if (result?.data) {
        setMilestones(result?.data);
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneIcon = (type) => {
    const icons = {
      followers: Star,
      revenue: Trophy,
      engagement: Target,
      content: Award,
    };
    return icons?.[type] || Award;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading milestone achievements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon name={Award} size={24} className="text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Milestone Achievement Tracking</h2>
        </div>
        <p className="text-gray-700">
          Creator progress monitoring with celebration notifications and achievement unlocks
        </p>
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {milestones?.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Icon name={Target} size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Milestones Tracked Yet</h3>
            <p className="text-gray-600">Milestones will appear as creators make progress</p>
          </div>
        ) : (
          milestones?.map((milestone) => {
            const MilestoneIcon = getMilestoneIcon(milestone?.milestoneType);
            const progress = getProgressPercentage(
              milestone?.currentValue || 0,
              milestone?.targetValue || 1
            );
            const isAchieved = milestone?.achievedAt !== null;

            return (
              <div
                key={milestone?.id}
                className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
                  isAchieved
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200' :'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      isAchieved ? 'bg-purple-500' : 'bg-purple-100'
                    }`}
                  >
                    <Icon
                      name={isAchieved ? CheckCircle : MilestoneIcon}
                      size={28}
                      className={isAchieved ? 'text-white' : 'text-purple-600'}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{milestone?.title}</h3>
                      {isAchieved && (
                        <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                          ACHIEVED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{milestone?.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">
                      {milestone?.currentValue || 0} / {milestone?.targetValue || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAchieved ? 'bg-purple-500' : 'bg-purple-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{progress}% Complete</p>
                </div>

                {/* Achievement Details */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-gray-600">Type</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {milestone?.milestoneType?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {isAchieved ? 'Achieved' : 'Created'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {isAchieved && milestone?.achievedAt
                        ? new Date(milestone?.achievedAt)?.toLocaleDateString()
                        : milestone?.createdAt
                        ? new Date(milestone?.createdAt)?.toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {isAchieved && milestone?.celebrationSent && (
                  <div className="mt-4 bg-purple-100 rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-purple-700 flex items-center gap-2">
                      <Icon name={Star} size={14} />
                      Celebration notification sent to creator
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MilestoneTrackingPanel;