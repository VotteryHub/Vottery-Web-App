import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PersonalizedRecommendationsPanel = ({ recommendations = [], userId }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const mockRecommendations = recommendations?.length > 0 ? recommendations : [
    {
      id: 'rec-1',
      type: 'election',
      title: 'Climate Action Initiative 2026',
      category: 'Environment',
      matchScore: 94,
      reason: 'Based on your voting history in environmental topics',
      confidence: 0.92,
      expectedEngagement: 'High'
    },
    {
      id: 'rec-2',
      type: 'election',
      title: 'Tech Innovation Funding Proposal',
      category: 'Technology',
      matchScore: 89,
      reason: 'Similar to elections you\'ve engaged with recently',
      confidence: 0.87,
      expectedEngagement: 'High'
    },
    {
      id: 'rec-3',
      type: 'creator',
      title: 'Follow: Sarah Chen',
      category: 'Creator',
      matchScore: 86,
      reason: 'Creates content aligned with your interests',
      confidence: 0.84,
      expectedEngagement: 'Medium'
    },
    {
      id: 'rec-4',
      type: 'election',
      title: 'Community Budget Allocation',
      category: 'Local Government',
      matchScore: 82,
      reason: 'Popular among users with similar voting patterns',
      confidence: 0.79,
      expectedEngagement: 'Medium'
    }
  ];

  const filters = [
    { value: 'all', label: 'All', count: mockRecommendations?.length },
    { value: 'election', label: 'Elections', count: mockRecommendations?.filter(r => r?.type === 'election')?.length },
    { value: 'creator', label: 'Creators', count: mockRecommendations?.filter(r => r?.type === 'creator')?.length }
  ];

  const filteredRecommendations = activeFilter === 'all' 
    ? mockRecommendations 
    : mockRecommendations?.filter(r => r?.type === activeFilter);

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getEngagementBadge = (level) => {
    if (level === 'High') return 'bg-green-100 text-green-700';
    if (level === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Personalized Recommendations</h2>
          <p className="text-sm text-muted-foreground">AI-curated content based on your behavior and preferences</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <Icon name="Sparkles" className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-700">AI Personalized</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {filters?.map((filter) => (
          <button
            key={filter?.value}
            onClick={() => setActiveFilter(filter?.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === filter?.value
                ? 'bg-primary text-white' :'bg-accent text-muted-foreground hover:bg-accent/80'
            }`}
          >
            {filter?.label}
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {filter?.count}
            </span>
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations?.map((rec) => (
          <div key={rec?.id} className="p-4 bg-accent rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon 
                    name={rec?.type === 'election' ? 'Vote' : 'User'} 
                    className="w-5 h-5 text-primary" 
                  />
                  <h3 className="font-semibold text-foreground">{rec?.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec?.reason}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-background border border-border rounded text-xs font-medium text-foreground">
                    {rec?.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getEngagementBadge(rec?.expectedEngagement)}`}>
                    {rec?.expectedEngagement} Engagement
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <div className={`px-3 py-1.5 border rounded-lg ${getMatchScoreColor(rec?.matchScore)}`}>
                  <p className="text-xs font-medium">Match</p>
                  <p className="text-lg font-bold">{rec?.matchScore}%</p>
                </div>
                <Button size="sm" variant="outline">
                  <Icon name="Eye" className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Brain" className="w-3 h-3" />
              <span>AI Confidence: {(rec?.confidence * 100)?.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
            <p className="text-2xl font-bold text-purple-900">{mockRecommendations?.length}</p>
            <p className="text-xs text-purple-700 mt-1">Active Recommendations</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
            <p className="text-2xl font-bold text-blue-900">
              {(mockRecommendations?.reduce((sum, r) => sum + r?.matchScore, 0) / mockRecommendations?.length)?.toFixed(0)}%
            </p>
            <p className="text-xs text-blue-700 mt-1">Avg Match Score</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
            <p className="text-2xl font-bold text-green-900">
              {mockRecommendations?.filter(r => r?.expectedEngagement === 'High')?.length}
            </p>
            <p className="text-xs text-green-700 mt-1">High Engagement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendationsPanel;