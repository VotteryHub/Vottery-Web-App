import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, Clock, Target } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { claudeCreatorSuccessService } from '../../../services/claudeCreatorSuccessService';

const ChurnPreventionPanel = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadInterventions();
  }, []);

  const loadInterventions = async () => {
    try {
      const result = await claudeCreatorSuccessService?.getChurnPreventionInterventions();
      if (result?.data) {
        setInterventions(result?.data);
      }
    } catch (error) {
      console.error('Error loading interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (interventionId, status, outcome) => {
    try {
      setUpdatingStatus(interventionId);
      await claudeCreatorSuccessService?.updateInterventionStatus(interventionId, status, outcome);
      await loadInterventions();
    } catch (error) {
      console.error('Error updating intervention status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors?.[status] || colors?.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600',
    };
    return colors?.[priority] || colors?.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      in_progress: Target,
      completed: CheckCircle,
      failed: AlertCircle,
    };
    return icons?.[status] || Clock;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading churn prevention interventions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-sm border border-orange-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon name={Shield} size={24} className="text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Predictive Churn Prevention</h2>
        </div>
        <p className="text-gray-700">
          Intervention strategy deployment and retention campaign automation with success tracking
        </p>
      </div>

      {/* Interventions List */}
      <div className="space-y-4">
        {interventions?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Icon name={Shield} size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Interventions</h3>
            <p className="text-gray-600">Interventions will appear when at-risk creators are identified</p>
          </div>
        ) : (
          interventions?.map((intervention) => {
            const StatusIcon = getStatusIcon(intervention?.status);
            return (
              <div
                key={intervention?.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={StatusIcon} size={24} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {intervention?.interventionType?.replace('_', ' ')}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            getStatusColor(intervention?.status)
                          }`}
                        >
                          {intervention?.status?.toUpperCase()?.replace('_', ' ')}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(intervention?.priority)}`}>
                          {intervention?.priority?.toUpperCase()} PRIORITY
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{intervention?.description}</p>

                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 mb-3">
                        <p className="text-xs font-semibold text-orange-700 mb-1">Strategy:</p>
                        <p className="text-sm text-orange-900">{intervention?.strategy}</p>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-600">Creator: </span>
                          <span className="font-medium text-gray-900">
                            #{intervention?.creatorId?.slice(0, 8)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Created: </span>
                          <span className="font-medium text-gray-900">
                            {intervention?.createdAt
                              ? new Date(intervention?.createdAt)?.toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                        {intervention?.completedAt && (
                          <div>
                            <span className="text-gray-600">Completed: </span>
                            <span className="font-medium text-gray-900">
                              {new Date(intervention?.completedAt)?.toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {intervention?.outcome && (
                        <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-xs font-semibold text-green-700 mb-1">Outcome:</p>
                          <p className="text-sm text-green-900">{intervention?.outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {intervention?.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateStatus(intervention?.id, 'in_progress', null)}
                        disabled={updatingStatus === intervention?.id}
                        size="sm"
                        variant="outline"
                      >
                        Start
                      </Button>
                      <Button
                        onClick={() =>
                          handleUpdateStatus(intervention?.id, 'completed', 'Successfully retained creator')
                        }
                        disabled={updatingStatus === intervention?.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Complete
                      </Button>
                    </div>
                  )}

                  {intervention?.status === 'in_progress' && (
                    <Button
                      onClick={() =>
                        handleUpdateStatus(intervention?.id, 'completed', 'Intervention successful')
                      }
                      disabled={updatingStatus === intervention?.id}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChurnPreventionPanel;