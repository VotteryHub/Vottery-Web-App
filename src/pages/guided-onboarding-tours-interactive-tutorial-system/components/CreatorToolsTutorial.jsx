import React from 'react';
import InteractiveTutorialEngine from './InteractiveTutorialEngine';

const CreatorToolsTutorial = ({ onComplete, onExit }) => {
  const steps = [
    {
      title: 'Welcome to Creator Tools',
      description: 'Learn how to create engaging elections and monetize your content on Vottery.',
      keyPoints: [
        'Create elections on any topic',
        'Earn revenue from your elections',
        'Build your audience and community'
      ]
    },
    {
      title: 'Election Creation Workflow',
      description: 'Master the step-by-step process of creating compelling elections.',
      keyPoints: [
        'Choose an engaging topic',
        'Add clear options for voters',
        'Set election duration and rules',
        'Add media to make it visually appealing'
      ],
      demo: (
        <div className="bg-slate-800 rounded p-4 space-y-3">
          <div>
            <div className="text-slate-400 text-sm mb-1">Step 1: Title</div>
            <div className="bg-slate-700 rounded p-2 text-white">What's the best programming language?</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Step 2: Options</div>
            <div className="space-y-1">
              <div className="bg-slate-700 rounded p-2 text-white text-sm">JavaScript</div>
              <div className="bg-slate-700 rounded p-2 text-white text-sm">Python</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Analytics Interpretation',description: 'Understand your election analytics and use data to improve engagement.',
      keyPoints: [
        'Track vote counts in real-time','Monitor engagement metrics','Analyze voter demographics','Identify trending patterns'
      ],
      practice: 'Review sample analytics to understand key metrics'
    },
    {
      title: 'Monetization Strategies',description: 'Learn how to earn revenue from your elections through various monetization methods.',
      keyPoints: [
        'Earn 70% revenue share from ads','Create sponsored elections for brands','Offer premium election features','Build a loyal subscriber base'
      ]
    },
    {
      title: 'Template-Based Learning',description: 'Use pre-built templates to quickly create professional elections.',
      keyPoints: [
        'Browse template library','Customize templates to your needs','Save your own templates for reuse'
      ],
      demo: (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800 rounded p-3 text-center">
            <div className="text-2xl mb-1">🎮</div>
            <div className="text-white text-sm">Gaming</div>
          </div>
          <div className="bg-slate-800 rounded p-3 text-center">
            <div className="text-2xl mb-1">🎬</div>
            <div className="text-white text-sm">Movies</div>
          </div>
        </div>
      )
    },
    {
      title: 'Creator Success!',description: 'You\'re now ready to create engaging elections and build your creator presence!',
      keyPoints: [
        'Start creating your first election',
        'Promote your elections on social media',
        'Engage with your voters in comments',
        'Track your earnings in the creator dashboard'
      ]
    }
  ];

  return (
    <InteractiveTutorialEngine
      steps={steps}
      onComplete={onComplete}
      onExit={onExit}
      title="Creator Tools Training"
      icon="🎨"
    />
  );
};

export default CreatorToolsTutorial;