import React, { useState, useEffect } from 'react';
import { Calendar, Target, CheckCircle, Clock, Zap } from 'lucide-react';

import { carouselCoachingService } from '../../../services/carouselCoachingService';

const ActionPlanTimeline = ({ creatorId }) => {
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActionItems();
  }, [creatorId]);

  const loadActionItems = async () => {
    try {
      const result = await carouselCoachingService?.getActionItems(creatorId);
      if (result?.data) {
        setActionItems(result?.data);
      }
    } catch (error) {
      console.error('Error loading action items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      await carouselCoachingService?.updateActionItem(itemId, { status: newStatus });
      await loadActionItems();
    } catch (error) {
      console.error('Error updating action item:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <Zap className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <Target className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 30-day action plan...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">30-Day Action Plan Timeline</h2>
      </div>

      <div className="space-y-4">
        {actionItems?.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No action items yet. Start a coaching conversation to generate your personalized plan.</p>
          </div>
        ) : (
          actionItems?.map((item, index) => (
            <div
              key={item?.id}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  {item?.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(item?.priority)}
                    <h3 className="font-semibold text-gray-900">{item?.actionTitle}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item?.status)}`}>
                    {item?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{item?.actionDescription}</p>

                {item?.dueDate && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>Due: {new Date(item?.dueDate)?.toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  {item?.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(item?.id, 'in_progress')}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Start
                    </button>
                  )}
                  {item?.status === 'in_progress' && (
                    <button
                      onClick={() => handleUpdateStatus(item?.id, 'completed')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Complete
                    </button>
                  )}
                  {item?.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(item?.id, 'cancelled')}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {actionItems?.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-900">Progress Overview</p>
              <p className="text-xs text-purple-700">
                {actionItems?.filter(a => a?.status === 'completed')?.length} of {actionItems?.length} completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((actionItems?.filter(a => a?.status === 'completed')?.length / actionItems?.length) * 100)}%
              </p>
              <p className="text-xs text-purple-700">Complete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPlanTimeline;