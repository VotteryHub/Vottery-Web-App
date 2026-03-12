import React from 'react';
import Icon from '../../../components/AppIcon';

const ResponseCoordinationPanel = ({ selectedIncident }) => {
  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to view response coordination</p>
      </div>
    );
  }

  const automatedActions = selectedIncident?.automatedActionsTaken || [];
  const timelineEvents = selectedIncident?.timelineEvents || [];

  return (
    <div className="space-y-6">
      {/* Automated Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Automated Response Actions
        </h3>
        <div className="space-y-3">
          {automatedActions?.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No automated actions taken yet</p>
          ) : (
            automatedActions?.map((action, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="CheckCircle" size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {action?.actionType}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {action?.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(action?.executedAt)?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Response Timeline
        </h3>
        <div className="space-y-4">
          {timelineEvents?.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No timeline events recorded</p>
          ) : (
            timelineEvents?.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  {idx < timelineEvents?.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {event?.eventType}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {event?.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(event?.timestamp)?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stakeholder Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} />
          Stakeholder Notifications
        </h3>
        <div className="space-y-3">
          {selectedIncident?.stakeholdersNotified?.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No stakeholders notified yet</p>
          ) : (
            selectedIncident?.stakeholdersNotified?.map((stakeholder, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {stakeholder?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stakeholder?.role}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                  Notified
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseCoordinationPanel;