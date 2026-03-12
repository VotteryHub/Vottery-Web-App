import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { anthropicSecurityReasoningService } from '../../../services/anthropicSecurityReasoningService';

const RemediationStrategyPanel = ({ incident, onSelectIncident, incidents }) => {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateStrategy = async (inc) => {
    setLoading(true);
    try {
      const rootCauseResult = await anthropicSecurityReasoningService?.performRootCauseAnalysis(inc);
      const { data, error } = await anthropicSecurityReasoningService?.generateRemediationStrategy(inc, rootCauseResult?.data);
      if (error) throw error;
      setStrategy(data);
    } catch (error) {
      console.error('Error generating remediation strategy:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!incident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <Icon name="Shield" size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Select an Incident</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose an incident to generate remediation strategy</p>
        {incidents?.length > 0 && (
          <button onClick={() => onSelectIncident(incidents?.[0])} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
            Analyze First Incident
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Shield" size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Remediation Strategy Generation</h3>
            <p className="text-gray-700 dark:text-gray-300">Comprehensive remediation strategies with confidence-scored recommendations</p>
            <div className="mt-4">
              <button onClick={() => generateStrategy(incident)} disabled={loading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors text-sm font-medium flex items-center gap-2">
                {loading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Generating...</>) : (<><Icon name="Shield" size={16} />Generate Strategy</>)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {strategy && (
        <>
          {strategy?.immediateActions?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon name="Zap" size={20} className="text-red-600 dark:text-red-400" />
                Immediate Actions
              </h3>
              <div className="space-y-3">
                {strategy?.immediateActions?.map((action, index) => (
                  <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{action?.action}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 font-medium uppercase">{action?.priority}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Timeframe: {action?.timeframe}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Confidence: {action?.confidence}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {strategy?.shortTermRemediation?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon name="Clock" size={20} />
                Short-Term Remediation
              </h3>
              <div className="space-y-3">
                {strategy?.shortTermRemediation?.map((action, index) => (
                  <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{action?.action}</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">{action?.confidence}% confidence</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Impact: {action?.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {strategy?.longTermPrevention?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={20} />
                Long-Term Prevention
              </h3>
              <div className="space-y-3">
                {strategy?.longTermPrevention?.map((measure, index) => (
                  <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{measure?.measure}</span>
                      <span className="text-xs text-green-600 dark:text-green-400">Effectiveness: {measure?.effectiveness}</span>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Confidence: {measure?.confidence}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RemediationStrategyPanel;