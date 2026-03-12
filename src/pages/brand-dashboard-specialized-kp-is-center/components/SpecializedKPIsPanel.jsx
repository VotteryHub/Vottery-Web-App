import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Heart, Target, Star, ThumbsUp } from 'lucide-react';
import revenueReportingService from '../../../services/revenueReportingService';
import Icon from '../../../components/AppIcon';


const SpecializedKPIsPanel = ({ selectedCampaign }) => {
  const [kpiData, setKpiData] = useState(null);
  const [cpxData, setCpxData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCampaign) {
      loadKPIData();
    }
  }, [selectedCampaign]);

  const loadKPIData = async () => {
    setLoading(true);
    try {
      // Load CPX calculation
      const cpxResult = await revenueReportingService?.calculateCPX(selectedCampaign?.id);
      if (cpxResult?.success) {
        setCpxData(cpxResult?.data);
      }

      // Simulate specialized KPIs (in production, these would come from surveys/tracking)
      const mockKPIs = {
        aided_recall: 68.5,
        unaided_recall: 42.3,
        purchase_intent_shift: 15.7,
        brand_affinity_score: 7.8,
        advocacy_generation_rate: 23.4,
        brand_lift_measurement: 12.9,
        engagement_quality_score: 8.2,
        audience_sentiment: 'Positive'
      };
      setKpiData(mockKPIs);
    } catch (error) {
      console.error('Error loading KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCampaign) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Select a campaign to view specialized KPIs</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading KPI data...</p>
      </div>
    );
  }

  const kpiMetrics = [
    {
      label: 'Aided Recall',
      value: `${kpiData?.aided_recall}%`,
      description: 'Users who remember brand when prompted',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      benchmark: 'Industry Avg: 55%'
    },
    {
      label: 'Unaided Recall',
      value: `${kpiData?.unaided_recall}%`,
      description: 'Users who remember brand without prompting',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      benchmark: 'Industry Avg: 35%'
    },
    {
      label: 'Purchase Intent Shift',
      value: `+${kpiData?.purchase_intent_shift}%`,
      description: 'Increase in likelihood to purchase',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      benchmark: 'Industry Avg: +10%'
    },
    {
      label: 'Brand Affinity Score',
      value: `${kpiData?.brand_affinity_score}/10`,
      description: 'Emotional connection with brand',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      benchmark: 'Industry Avg: 6.5/10'
    },
    {
      label: 'Advocacy Generation',
      value: `${kpiData?.advocacy_generation_rate}%`,
      description: 'Users likely to recommend brand',
      icon: ThumbsUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      benchmark: 'Industry Avg: 18%'
    },
    {
      label: 'Brand Lift',
      value: `+${kpiData?.brand_lift_measurement}%`,
      description: 'Overall brand perception improvement',
      icon: Target,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      benchmark: 'Industry Avg: +8%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Brand-Specific Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Award className="w-5 h-5 mr-2 text-purple-600" />
          Brand-Specific Performance Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiMetrics?.map((metric, index) => {
            const Icon = metric?.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${metric?.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${metric?.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{metric?.value}</p>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{metric?.label}</h4>
                <p className="text-sm text-gray-600 mb-2">{metric?.description}</p>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{metric?.benchmark}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* CPX (Cost Per XP) Analysis */}
      {cpxData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            CPX (Cost Per 1,000 XP) Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total XP Granted</p>
              <p className="text-2xl font-bold text-gray-900">
                {cpxData?.total_xp_granted?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">CPX</p>
              <p className="text-2xl font-bold text-gray-900">
                ${cpxData?.cpx}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Reward Multiplier</p>
              <p className="text-2xl font-bold text-gray-900">
                {cpxData?.reward_multiplier}x
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Brand Sentiment</p>
              <p className="text-2xl font-bold text-gray-900">
                {cpxData?.brand_sentiment_score}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Insight:</strong> Your CPX of ${cpxData?.cpx} means you're spending ${cpxData?.cpx} to grant 1,000 XP to the community. 
              This creates positive brand sentiment as users feel rewarded for engaging with your content.
            </p>
          </div>
        </div>
      )}
      {/* Engagement Quality Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-600" />
          Engagement Quality Score
        </h3>

        <div className="flex items-center mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
            <div
              className="bg-gradient-to-r from-yellow-400 to-green-500 h-8 rounded-full flex items-center justify-end pr-4"
              style={{ width: `${(kpiData?.engagement_quality_score / 10) * 100}%` }}
            >
              <span className="text-sm font-bold text-white">
                {kpiData?.engagement_quality_score}/10
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Time Spent</p>
            <p className="text-lg font-semibold text-gray-900">2m 34s avg</p>
            <p className="text-xs text-green-600 mt-1">+18% vs industry</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
            <p className="text-lg font-semibold text-gray-900">87.3%</p>
            <p className="text-xs text-green-600 mt-1">+12% vs industry</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Social Shares</p>
            <p className="text-lg font-semibold text-gray-900">1,247</p>
            <p className="text-xs text-green-600 mt-1">+25% vs industry</p>
          </div>
        </div>
      </div>
      {/* Audience Sentiment Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-600" />
          Audience Sentiment Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Positive</span>
              <span className="text-lg font-bold text-green-600">68%</span>
            </div>
            <div className="bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Neutral</span>
              <span className="text-lg font-bold text-yellow-600">24%</span>
            </div>
            <div className="bg-yellow-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Negative</span>
              <span className="text-lg font-bold text-red-600">8%</span>
            </div>
            <div className="bg-red-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '8%' }}></div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Overall Sentiment:</strong> {kpiData?.audience_sentiment} - Your participatory advertising campaign is generating strong positive sentiment. 
            Users appreciate being part of the decision-making process.
          </p>
        </div>
      </div>
      {/* Comparative Benchmarking */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Comparative Benchmarking vs Industry Standards
        </h3>

        <div className="space-y-4">
          {[
            { metric: 'Engagement Rate', yours: 8.2, industry: 5.3 },
            { metric: 'Brand Recall', yours: 68.5, industry: 55.0 },
            { metric: 'Purchase Intent', yours: 15.7, industry: 10.2 },
            { metric: 'Advocacy Rate', yours: 23.4, industry: 18.0 }
          ]?.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item?.metric}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Industry: {item?.industry}%</span>
                  <span className="text-sm font-bold text-blue-600">Yours: {item?.yours}%</span>
                </div>
              </div>
              <div className="relative bg-gray-200 rounded-full h-3">
                <div
                  className="absolute bg-gray-400 h-3 rounded-full"
                  style={{ width: `${(item?.industry / Math.max(item?.yours, item?.industry)) * 100}%` }}
                ></div>
                <div
                  className="absolute bg-blue-600 h-3 rounded-full"
                  style={{ width: `${(item?.yours / Math.max(item?.yours, item?.industry)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecializedKPIsPanel;