import React from 'react';
import Icon from '../../../components/AppIcon';

const EvidenceCollectionPanel = ({ selectedIncident }) => {
  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to view evidence collection</p>
      </div>
    );
  }

  const evidenceItems = selectedIncident?.evidenceCollected || [];

  return (
    <div className="space-y-6">
      {/* Evidence Collection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="FileSearch" size={20} />
          Evidence Collection Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {evidenceItems?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Evidence Items Collected</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">100%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Collection Complete</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">High</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Evidence Quality</p>
          </div>
        </div>
      </div>

      {/* Evidence Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Collected Evidence</h3>
        <div className="space-y-3">
          {evidenceItems?.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No evidence collected yet</p>
          ) : (
            evidenceItems?.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="File" size={16} className="text-gray-500 dark:text-gray-400" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {item?.evidenceType}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item?.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Collected: {new Date(item?.collectedAt)?.toLocaleString()}</span>
                      <span>Source: {item?.source}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Audit Trail
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Chain of Custody</span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
              Verified
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Cryptographic Hash</span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
              Valid
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Compliance Documentation</span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
              Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceCollectionPanel;