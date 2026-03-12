import React from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeMonitoringPanel = ({ incidents }) => {
  const activeIncidents = incidents?.filter(i => i?.status === 'active' || i?.status === 'in_progress') || [];
  const resolvedToday = incidents?.filter(i => {
    const resolvedDate = new Date(i?.resolvedAt);
    const today = new Date();
    return i?.status === 'resolved' && resolvedDate?.toDateString() === today?.toDateString();
  })?.length || 0;

  const timelineEvents = incidents
    ?.slice(0, 20)
    ?.map(incident => ({
      id: incident?.id,
      type: incident?.incidentType,
      title: incident?.title,
      severity: incident?.severity,
      status: incident?.status,
      timestamp: incident?.detectedAt,
      escalationLevel: incident?.escalationLevel
    }))
    ?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp));

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-green-600 dark:text-green-400';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Activity" size={24} className="text-blue-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {activeIncidents?.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Incidents</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle" size={24} className="text-green-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {resolvedToday}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Today</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={24} className="text-orange-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              12m
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Resolution Time</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="text-purple-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              94%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
        </div>
      </div>

      {/* Incident Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Real-Time Incident Timeline
        </h3>
        <div className="space-y-4">
          {timelineEvents?.map((event, index) => (
            <div key={event?.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(event?.severity)}`} />
                {index < timelineEvents?.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {event?.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(event?.timestamp)?.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-semibold capitalize ${getStatusColor(event?.status)}`}>
                    {event?.status}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {event?.type?.replace('_', ' ')}
                  </span>
                  {event?.escalationLevel && (
                    <>
                      <span className="text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Escalation Level {event?.escalationLevel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Workflows */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Automated Escalation Workflows
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-red-900 dark:text-red-300">Critical Severity</span>
              <span className="text-xs text-red-700 dark:text-red-400">Immediate Escalation</span>
            </div>
            <p className="text-xs text-red-800 dark:text-red-400">
              → Executive team + Security lead + On-call engineer
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">High Severity</span>
              <span className="text-xs text-orange-700 dark:text-orange-400">15-minute threshold</span>
            </div>
            <p className="text-xs text-orange-800 dark:text-orange-400">
              → Team lead + Subject matter expert
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">Medium Severity</span>
              <span className="text-xs text-yellow-700 dark:text-yellow-400">1-hour threshold</span>
            </div>
            <p className="text-xs text-yellow-800 dark:text-yellow-400">
              → On-call team member
            </p>
          </div>
        </div>
      </div>

      {/* Resolution Progress Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Resolution Progress Tracking
        </h3>
        <div className="space-y-4">
          {activeIncidents?.slice(0, 5)?.map((incident) => (
            <div key={incident?.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">{incident?.title}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{incident?.resolutionProgress || 45}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${incident?.resolutionProgress || 45}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoringPanel;