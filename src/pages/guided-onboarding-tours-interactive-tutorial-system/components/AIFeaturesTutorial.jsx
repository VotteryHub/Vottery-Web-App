import React from 'react';
import InteractiveTutorialEngine from './InteractiveTutorialEngine';

const AIFeaturesTutorial = ({ onComplete, onExit }) => {
  const steps = [
    {
      title: 'AI-Powered Platform',
      description: 'Discover how artificial intelligence enhances your Vottery experience.',
      keyPoints: [
        'Claude AI provides personalized recommendations',
        'Perplexity offers real-time insights',
        'Automated optimization improves performance',
        'AI helps detect fraud and ensure fairness'
      ]
    },
    {
      title: 'Claude Recommendations',
      description: 'Learn how Claude AI analyzes your preferences to suggest relevant elections.',
      keyPoints: [
        'Personalized election recommendations',
        'Content curation based on your interests',
        'Smart feed ranking for better discovery',
        'Contextual analysis of voting patterns'
      ],
      demo: (
        <div className="bg-slate-800 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-2xl">🤖</div>
            <div className="text-white font-semibold">Claude Suggests</div>
          </div>
          <div className="space-y-2">
            <div className="bg-slate-700 rounded p-2 text-sm text-slate-300">
              Based on your interest in technology, you might like "Best AI Tool 2024"
            </div>
            <div className="text-xs text-slate-400">Confidence: 92%</div>
          </div>
        </div>
      )
    },
    {
      title: 'Perplexity Insights',
      description: 'Understand how Perplexity AI provides real-time market intelligence and competitive analysis.',
      keyPoints: [
        'Real-time trend analysis',
        'Market research insights',
        'Competitive intelligence',
        'Sentiment analysis across platforms'
      ],
      practice: 'Explore AI-generated insights on a sample election'
    },
    {
      title: 'Automated Optimization',
      description: 'See how AI automatically optimizes your experience for better performance.',
      keyPoints: [
        'Dynamic content ranking',
        'Performance optimization',
        'Fraud detection and prevention',
        'Smart notification timing'
      ]
    },
    {
      title: 'Confidence Scoring',
      description: 'Learn how AI confidence scores help you make informed decisions.',
      keyPoints: [
        'Recommendation confidence levels',
        'Prediction accuracy indicators',
        'Trust scores for content',
        'Quality assessment metrics'
      ],
      demo: (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-slate-800 rounded">
            <span className="text-white text-sm">Recommendation Quality</span>
            <span className="text-green-400 font-semibold">95%</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-800 rounded">
            <span className="text-white text-sm">Prediction Accuracy</span>
            <span className="text-blue-400 font-semibold">88%</span>
          </div>
        </div>
      )
    },
    {
      title: 'AI-Assisted Creation',
      description: 'Discover how AI helps creators make better elections.',
      keyPoints: [
        'Smart title suggestions',
        'Optimal timing recommendations',
        'Audience targeting insights',
        'Content improvement suggestions'
      ]
    },
    {
      title: 'Privacy & Transparency',
      description: 'Understand how AI respects your privacy while providing personalized experiences.',
      keyPoints: [
        'Your data is encrypted and secure',
        'AI explanations are transparent',
        'You control your data sharing',
        'Opt-out options available anytime'
      ]
    },
    {
      title: 'AI Mastery Complete!',
      description: 'You now understand how AI enhances your Vottery experience!',
      keyPoints: [
        'AI works behind the scenes to improve your experience',
        'Check AI insights in your dashboard',
        'Provide feedback to improve AI recommendations',
        'Explore all platform features with AI assistance'
      ]
    }
  ];

  return (
    <InteractiveTutorialEngine
      steps={steps}
      onComplete={onComplete}
      onExit={onExit}
      title="AI Features Introduction"
      icon="🤖"
    />
  );
};

export default AIFeaturesTutorial;