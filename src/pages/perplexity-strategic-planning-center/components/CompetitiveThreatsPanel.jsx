import React from 'react';
import Icon from '../../../components/AppIcon';

const CompetitiveThreatsPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {data?.threats?.map((threat, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  threat?.severity === 'high' ?'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {threat?.severity?.toUpperCase()} SEVERITY
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                  {threat?.type?.toUpperCase()}
                </span>
              </div>
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">{threat?.description}</p>
            </div>
          </div>

          {/* Threat Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Probability</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {Math.round((threat?.probability || 0) * 100)}%
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Impact Level</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1 capitalize">
                {threat?.impact}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Timeframe</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {threat?.timeframe}
              </p>
            </div>
          </div>

          {/* Countermeasures */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Icon name="Shield" size={16} className="text-green-500" />
              Strategic Countermeasures
            </h4>
            <div className="space-y-3">
              {threat?.countermeasures?.map((counter, cIdx) => (
                <div key={cIdx} className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{counter?.action}</p>
                    <span className="ml-3 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded whitespace-nowrap">
                      {counter?.timeline}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Resources: {counter?.resources}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompetitiveThreatsPanel;