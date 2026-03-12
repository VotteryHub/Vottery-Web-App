import React from 'react';
import Icon from '../../../components/AppIcon';

const ActiveIncidentsPanel = ({ incidents, selectedIncident, onSelectIncident }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-700', text: 'text-red-600 dark:text-red-400' };
      case 'high': return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', text: 'text-orange-600 dark:text-orange-400' };
      case 'medium': return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-700', text: 'text-yellow-600 dark:text-yellow-400' };
      default: return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-600 dark:text-blue-400' };
    }
  };

  if (incidents?.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <Icon name="Shield" size={48} className="mx-auto mb-4 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Active Incidents</h3>
        <p className="text-gray-600 dark:text-gray-400">All security incidents have been resolved. System is operating normally.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="AlertTriangle" size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Active Security Incidents</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {incidents?.length} active incident{incidents?.length !== 1 ? 's' : ''} requiring attention and Claude-powered analysis
            </p>
          </div>
        </div>
      </div>
      {incidents?.map((incident) => {
        const colors = getSeverityColor(incident?.severity);
        const isSelected = selectedIncident?.id === incident?.id;
        
        return (
          <div
            key={incident?.id}
            onClick={() => onSelectIncident(incident)}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 border cursor-pointer transition-all ${
              isSelected 
                ? 'border-primary shadow-lg' 
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg ${colors?.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name="AlertTriangle" size={24} className={colors?.text} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {incident?.type || 'Security Incident'}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${colors?.bg} ${colors?.text} font-medium uppercase`}>
                    {incident?.severity}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {incident?.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {incident?.description || 'No description available'}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Detected:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {new Date(incident?.createdAt || incident?.timestamp)?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Affected Systems:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {incident?.affectedSystems?.length || 0} system{incident?.affectedSystems?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                      Analyze with Claude
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActiveIncidentsPanel;