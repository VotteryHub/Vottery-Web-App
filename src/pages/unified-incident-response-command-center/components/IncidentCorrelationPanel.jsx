import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { unifiedIncidentResponseService } from '../../../services/unifiedIncidentResponseService';

const IncidentCorrelationPanel = ({ incidents }) => {
  const [correlatedGroups, setCorrelatedGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (incidents?.length > 0) {
      analyzeCorrelations();
    }
  }, [incidents]);

  const analyzeCorrelations = async () => {
    setLoading(true);
    try {
      const { data, error } = await unifiedIncidentResponseService?.correlateIncidents(incidents);
      if (error) throw error;
      setCorrelatedGroups(data || []);
    } catch (error) {
      console.error('Error analyzing correlations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      default: return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="GitMerge" size={24} className="text-primary" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {correlatedGroups?.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Correlated Groups</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertTriangle" size={24} className="text-red-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {incidents?.filter(i => i?.incidentType === 'fraud_alert')?.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fraud Alerts</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="XCircle" size={24} className="text-orange-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {incidents?.filter(i => i?.incidentType === 'system_failure')?.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">System Failures</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="DollarSign" size={24} className="text-yellow-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {incidents?.filter(i => i?.incidentType === 'revenue_anomaly')?.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Revenue Anomalies</p>
        </div>
      </div>

      {/* Correlated Incident Groups */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Icon name="GitMerge" size={20} />
          AI-Powered Incident Correlation
        </h3>

        {correlatedGroups?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No correlated incident patterns detected</p>
          </div>
        ) : (
          correlatedGroups?.map((group, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(group?.severity)}`}>
                      {group?.severity?.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {group?.incidentCount} Related Incidents
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {group?.confidence}% Confidence
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {group?.correlationType}: {group?.pattern}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {group?.description}
                  </p>
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Icon name="Search" size={16} />
                  Root Cause Analysis
                </h5>
                <p className="text-sm text-blue-800 dark:text-blue-400">{group?.rootCause}</p>
              </div>

              {/* Related Incidents */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Related Incidents:</h5>
                {group?.relatedIncidents?.map((incident) => (
                  <div
                    key={incident?.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        name={
                          incident?.type === 'fraud_alert' ? 'ShieldAlert' :
                          incident?.type === 'system_failure' ? 'XCircle' : 'DollarSign'
                        }
                        size={16}
                        className="text-gray-600 dark:text-gray-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{incident?.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(incident?.timestamp)?.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Impact Assessment */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{group?.impactScore}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Impact Score</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{group?.affectedUsers}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Affected Users</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">${group?.estimatedLoss}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Est. Loss</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentCorrelationPanel;