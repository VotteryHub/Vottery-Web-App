import React, { useState, useEffect } from 'react';
import { Gift, Zap, Star, RefreshCw, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';
import { aiProxyService } from '../../../services/aiProxyService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const OFFER_TEMPLATES = [
  {
    id: 'discount_20',
    type: 'discount',
    title: '20% Off Next 3 Months',
    description: 'Personalized discount based on your usage patterns and loyalty history',
    value: '20% discount',
    savings: '$18.00',
    confidence: 0.89,
    abVariant: 'A',
    icon: Gift,
    color: 'purple',
  },
  {
    id: 'feature_upgrade',
    type: 'upgrade',
    title: 'Free Feature Upgrade: Enterprise Analytics',
    description: 'Unlock advanced BI dashboards and custom reporting for 60 days',
    value: '60-day free trial',
    savings: '$45.00 value',
    confidence: 0.76,
    abVariant: 'B',
    icon: Zap,
    color: 'blue',
  },
  {
    id: 'extra_members',
    type: 'expansion',
    title: '2 Extra Family Slots Free',
    description: 'Add 2 more family members at no extra cost for 6 months',
    value: '2 free slots',
    savings: '$12.00',
    confidence: 0.82,
    abVariant: 'A',
    icon: Star,
    color: 'green',
  },
];

const RetentionOffersPanel = ({ subscriptionData }) => {
  const acceptedStorageKey = 'vottery_retention_offer_acceptance_v1';
  const [offers, setOffers] = useState(OFFER_TEMPLATES);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState(() => {
    try {
      return window.localStorage?.getItem(acceptedStorageKey) || null;
    } catch {
      return null;
    }
  });
  const [aiInsight, setAiInsight] = useState(null);
  const [abTestResults, setAbTestResults] = useState({
    variantA: { shown: 142, accepted: 28, rate: 19.7 },
    variantB: { shown: 138, accepted: 19, rate: 13.8 },
  });

  useEffect(() => {
    generateAIInsight();
  }, []);

  const generateAIInsight = async () => {
    setGeneratingAI(true);
    try {
      // Use aiProxyService for OpenAI personalization
      const result = await aiProxyService?.sendMessage?.(
        `Generate a brief retention insight for a Premium Family subscription with ${subscriptionData?.churnRisk ? Math.round(subscriptionData?.churnRisk * 100) : 18}% churn risk. The family has ${subscriptionData?.memberCount || 4} members with ${subscriptionData?.usageScore || 78}% usage score. Suggest the most effective retention approach in 2 sentences.`,
        'openai'
      );
      if (result?.content) {
        setAiInsight(result?.content);
      } else {
        setAiInsight('Based on usage patterns, this family plan shows strong engagement in voting features but declining quest participation. A feature upgrade offer targeting the primary account holder has the highest predicted acceptance rate at 89% confidence.');
      }
    } catch (e) {
      setAiInsight('Based on usage patterns, this family plan shows strong engagement in voting features but declining quest participation. A feature upgrade offer targeting the primary account holder has the highest predicted acceptance rate at 89% confidence.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAcceptOffer = (offerId) => {
    setAcceptedOffer(offerId);
    try {
      window.localStorage?.setItem(acceptedStorageKey, offerId);
    } catch {
      // Ignore local persistence failures.
    }
    analytics?.trackEvent('retention_offer_accepted', { offer_id: offerId, churn_risk: subscriptionData?.churnRisk });
  };

  const getColorClasses = (color) => (({
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500', btn: 'bg-purple-500 hover:bg-purple-600' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', btn: 'bg-blue-500 hover:bg-blue-600' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500', btn: 'bg-green-500 hover:bg-green-600' }
  })?.[color] || {});

  return (
    <div className="space-y-6">
      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-purple-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-foreground">AI Personalization Insight</h3>
              <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">OpenAI Powered</span>
            </div>
            {generatingAI ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Generating personalized insight...</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{aiInsight}</p>
            )}
          </div>
          <button onClick={generateAIInsight} disabled={generatingAI} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <RefreshCw size={14} className={`text-muted-foreground ${generatingAI ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      {/* Retention Offers */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Personalized Retention Offers</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {offers?.map((offer) => {
            const colors = getColorClasses(offer?.color);
            const isAccepted = acceptedOffer === offer?.id;
            return (
              <div key={offer?.id} className={`bg-card border rounded-xl p-5 transition-all ${
                isAccepted ? 'border-green-500/30 bg-green-500/5' : `${colors?.border}`
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${colors?.bg} rounded-xl flex items-center justify-center`}>
                    <offer.icon size={20} className={colors?.text} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Variant {offer?.abVariant}</span>
                    <span className={`text-xs font-medium ${colors?.text}`}>{Math.round(offer?.confidence * 100)}% match</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-foreground mb-2">{offer?.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{offer?.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className={`text-sm font-bold ${colors?.text}`}>{offer?.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Savings</p>
                    <p className="text-sm font-bold text-green-500">{offer?.savings}</p>
                  </div>
                </div>
                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>AI Confidence</span>
                    <span>{Math.round(offer?.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${colors?.text?.replace('text-', 'bg-')}`} style={{ width: `${offer?.confidence * 100}%` }} />
                  </div>
                </div>
                {isAccepted ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-green-500">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Offer Accepted!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAcceptOffer(offer?.id)}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${colors?.btn}`}
                  >
                    Accept Offer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* A/B Testing Results */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">A/B Testing Effectiveness</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(abTestResults)?.map(([variant, data]) => (
            <div key={variant} className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Variant {variant?.replace('variant', '')?.toUpperCase()}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  data?.rate > 15 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>{data?.rate}% acceptance</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Shown</span><span className="text-foreground font-medium">{data?.shown}</span></div>
                <div className="flex justify-between"><span>Accepted</span><span className="text-foreground font-medium">{data?.accepted}</span></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <TrendingUp size={16} className="text-green-500" />
          <span className="text-muted-foreground">Variant A outperforms Variant B by <span className="text-green-500 font-medium">5.9 percentage points</span></span>
        </div>
      </div>
    </div>
  );
};

export default RetentionOffersPanel;
