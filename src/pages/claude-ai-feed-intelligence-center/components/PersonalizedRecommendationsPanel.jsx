import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const PersonalizedRecommendationsPanel = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const mockData = {
        electionRecommendations: [
          {
            id: 1,
            title: 'Climate Action Initiative 2024',
            matchScore: 96.8,
            confidenceScore: 94.2,
            votingPatternMatch: 'Strong',
            reasoningChain: [
              'User has voted in 8 environmental elections',
              'High engagement with sustainability topics',
              'Preference score: 92% for climate-related content',
              'Historical participation rate: 95% in similar elections'
            ],
            predictedEngagement: 'Very High',
            recommendationStrength: 'Strong'
          },
          {
            id: 2,
            title: 'Tech Innovation Awards',
            matchScore: 89.4,
            confidenceScore: 87.6,
            votingPatternMatch: 'Moderate',
            reasoningChain: [
              'User follows 12 tech-related topics',
              'Moderate engagement with innovation content',
              'Preference score: 78% for technology elections',
              'Historical participation rate: 68% in tech elections'
            ],
            predictedEngagement: 'High',
            recommendationStrength: 'Moderate'
          }
        ],
        votingPatternAnalysis: {
          totalVotes: 234,
          avgVotesPerWeek: 8.5,
          topCategories: ['Environment', 'Technology', 'Social Issues'],
          engagementDepth: 'Deep',
          participationConsistency: 92.3
        },
        preferenceConfidence: {
          highConfidence: 12,
          mediumConfidence: 8,
          lowConfidence: 3,
          totalPreferences: 23
        }
      };
      setRecommendations(mockData);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (match) => {
    if (match === 'Strong') return 'text-success';
    if (match === 'Moderate') return 'text-warning';
    return 'text-muted-foreground';
  };

  const getStrengthBadge = (strength) => {
    const colors = {
      'Strong': 'bg-success/10 text-success',
      'Moderate': 'bg-warning/10 text-warning',
      'Weak': 'bg-muted text-foreground'
    };
    return colors?.[strength] || colors?.['Weak'];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Personalized Election Recommendations
        </h2>
        <Button onClick={loadRecommendations}>
          <Icon name="RefreshCw" size={16} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{recommendations?.preferenceConfidence?.highConfidence}</p>
                  <p className="text-sm text-muted-foreground">High Confidence</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Icon name="AlertCircle" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{recommendations?.preferenceConfidence?.mediumConfidence}</p>
                  <p className="text-sm text-muted-foreground">Medium Confidence</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Icon name="HelpCircle" size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{recommendations?.preferenceConfidence?.lowConfidence}</p>
                  <p className="text-sm text-muted-foreground">Low Confidence</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Voting Pattern Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Votes</p>
                <p className="text-xl font-bold text-foreground">{recommendations?.votingPatternAnalysis?.totalVotes}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Votes/Week</p>
                <p className="text-xl font-bold text-foreground">{recommendations?.votingPatternAnalysis?.avgVotesPerWeek}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Engagement Depth</p>
                <p className="text-xl font-bold text-primary">{recommendations?.votingPatternAnalysis?.engagementDepth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Consistency</p>
                <p className="text-xl font-bold text-foreground">{recommendations?.votingPatternAnalysis?.participationConsistency}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Top Categories</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recommendations?.votingPatternAnalysis?.topCategories?.slice(0, 2)?.map((cat, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">{cat}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recommended Elections</h3>
            {recommendations?.electionRecommendations?.map((rec) => (
              <div key={rec?.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">{rec?.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-md ${getStrengthBadge(rec?.recommendationStrength)}`}>
                          {rec?.recommendationStrength} Recommendation
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Voting Pattern Match: <span className={`font-semibold ${getMatchColor(rec?.votingPatternMatch)}`}>{rec?.votingPatternMatch}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{rec?.matchScore}%</p>
                      <p className="text-xs text-muted-foreground">Match Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                      <p className="text-lg font-bold text-foreground">{rec?.confidenceScore}%</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Predicted Engagement</p>
                      <p className="text-lg font-bold text-foreground">{rec?.predictedEngagement}</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="Brain" size={16} className="text-primary" />
                      Claude Reasoning Chain
                    </p>
                    <ul className="space-y-2">
                      {rec?.reasoningChain?.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalizedRecommendationsPanel;