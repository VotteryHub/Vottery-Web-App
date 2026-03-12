import React from 'react';
import InteractiveTutorialEngine from './InteractiveTutorialEngine';

const VotingMechanicsTutorial = ({ onComplete, onExit }) => {
  const steps = [
    {
      title: 'Introduction to Voting',
      description: 'Learn how to participate in elections and make your voice heard on Vottery.',
      keyPoints: [
        'Browse active elections from the Elections page',
        'Each vote earns you VP (Vottery Points)',
        'Your votes are secure and verifiable'
      ]
    },
    {
      title: 'Finding Elections',
      description: 'Discover elections that match your interests and participate in topics you care about.',
      keyPoints: [
        'Use filters to find elections by category',
        'Check trending elections for popular topics',
        'Follow creators to see their new elections'
      ],
      demo: (
        <div className="space-y-2">
          <div className="p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
            <div className="text-white font-semibold">🎮 Best Gaming Console 2024</div>
            <div className="text-slate-400 text-sm">Ends in 2 days • 1,234 votes</div>
          </div>
          <div className="p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
            <div className="text-white font-semibold">🎬 Favorite Movie Genre</div>
            <div className="text-slate-400 text-sm">Ends in 5 days • 892 votes</div>
          </div>
        </div>
      )
    },
    {
      title: 'Casting Your Vote',
      description: 'Learn the different voting methods and how to cast your vote effectively.',
      keyPoints: [
        'Plurality: Choose one option',
        'Ranked Choice: Rank options in order of preference',
        'Approval: Select all options you approve',
        'Plus/Minus: Rate each option positively or negatively'
      ],
      practice: 'Try casting a vote in a practice election!'
    },
    {
      title: 'Verification Process',
      description: 'Understand how your vote is verified and secured using blockchain technology.',
      keyPoints: [
        'Each vote receives a cryptographic receipt',
        'Verify your vote anytime using your receipt',
        'Blockchain ensures votes cannot be tampered with'
      ],
      demo: (
        <div className="bg-slate-800 rounded p-4">
          <div className="text-green-400 font-semibold mb-2">✓ Vote Verified</div>
          <div className="text-slate-400 text-sm mb-2">Receipt: 0x7a8f...</div>
          <div className="text-xs text-slate-500">Blockchain: Confirmed</div>
        </div>
      )
    },
    {
      title: 'Earning VP Rewards',
      description: 'Discover how voting earns you VP and how to maximize your rewards.',
      keyPoints: [
        'Earn 10-20 VP per vote',
        'Bonus VP for early participation',
        'Prediction accuracy increases rewards'
      ]
    },
    {
      title: 'Practice Voting Scenarios',
      description: 'Try out different voting scenarios in a safe sandbox environment.',
      keyPoints: [
        'Practice with sample elections',
        'Learn from interactive examples',
        'Build confidence before voting in real elections'
      ],
      practice: 'Complete a practice vote to earn your first VP!'
    },
    {
      title: 'Voting Mastery Achieved!',
      description: 'You\'ve mastered the voting mechanics! You\'re now ready to participate in any election.',
      keyPoints: [
        'Start voting in real elections to earn VP',
        'Check your voting history in your profile',
        'Explore creator tools to create your own elections'
      ]
    }
  ];

  return (
    <InteractiveTutorialEngine
      steps={steps}
      onComplete={onComplete}
      onExit={onExit}
      title="Voting Mechanics Guide"
      icon="🗳️"
    />
  );
};

export default VotingMechanicsTutorial;