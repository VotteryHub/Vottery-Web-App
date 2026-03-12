import React, { useState, useEffect } from 'react';
import { AlertTriangle, User, TrendingDown, Shield } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { claudeCreatorSuccessService } from '../../../services/claudeCreatorSuccessService';

const AtRiskCreatorsPanel = () => {
  const [atRiskCreators, setAtRiskCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingIntervention, setCreatingIntervention] = useState(null);

  useEffect(() => {
    loadAtRiskCreators();
  }, []);

  const loadAtRiskCreators = async () => {
    try {
      const result = await claudeCreatorSuccessService?.getAtRiskCreators();
      if (result?.data) {
        setAtRiskCreators(result?.data);
      }
    } catch (error) {
      console.error('Error loading at-risk creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntervention = async (creator) => {
    try {
      setCreatingIntervention(creator?.creatorId);
      await claudeCreatorSuccessService?.createIntervention({
        creatorId: creator?.creatorId,
        interventionType: 'engagement_boost',
        strategy: 'Personalized re-engagement campaign',
        description: `Automated intervention for creator with health score ${creator?.healthScore}`,
        priority: 'high',
      });
      alert('Intervention created successfully!');
    } catch (error) {
      console.error('Error creating intervention:', error);
    } finally {
      setCreatingIntervention(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Identifying at-risk creators...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon name={AlertTriangle} size={24} className="text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">At-Risk Creator Identification</h2>
        </div>
        <p className="text-gray-700">
          Creators with high churn risk requiring immediate intervention
        </p>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              {atRiskCreators?.length} High-Risk Creators
            </span>
          </div>
        </div>
      </div>

      {/* At-Risk Creators List */}
      <div className="space-y-4">
        {atRiskCreators?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Icon name={Shield} size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Creators Healthy!</h3>
            <p className="text-gray-600">No high-risk creators detected at this time</p>
          </div>
        ) : (
          atRiskCreators?.map((creator) => (
            <div
              key={creator?.id}
              className="bg-white rounded-xl shadow-sm border-l-4 border-l-red-500 border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    {creator?.userProfiles?.avatarUrl ? (
                      <img
                        src={creator?.userProfiles?.avatarUrl}
                        alt="Creator"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Icon name={User} size={32} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {creator?.userProfiles?.fullName || `Creator #${creator?.creatorId?.slice(0, 8)}`}
                      </h3>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                        HIGH RISK
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Health Score</p>
                        <p className="text-lg font-bold text-red-600">{creator?.healthScore || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Churn Risk</p>
                        <p className="text-lg font-bold text-red-600">
                          {Math.round((creator?.churnRisk || 0) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Engagement</p>
                        <div className="flex items-center gap-1">
                          <Icon name={TrendingDown} size={16} className="text-red-600" />
                          <p className="text-sm font-medium text-red-600">Declining</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Last Active</p>
                        <p className="text-sm font-medium text-gray-900">
                          {creator?.lastActiveAt
                            ? new Date(creator?.lastActiveAt)?.toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleCreateIntervention(creator)}
                  disabled={creatingIntervention === creator?.creatorId}
                  variant="destructive"
                  size="sm"
                >
                  {creatingIntervention === creator?.creatorId ? 'Creating...' : 'Create Intervention'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AtRiskCreatorsPanel;