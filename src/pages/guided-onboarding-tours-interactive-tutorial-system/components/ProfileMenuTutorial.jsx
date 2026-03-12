import React from 'react';
import InteractiveTutorialEngine from './InteractiveTutorialEngine';

const ProfileMenuTutorial = ({ onComplete, onExit }) => {
  const steps = [
    {
      title: 'Welcome to Your Profile',
      description: 'Your profile is your identity on Vottery. Let\'s explore how to set it up and customize it to reflect who you are.',
      keyPoints: [
        'Access your profile from the top-right menu',
        'Your profile displays your voting history and achievements',
        'Customize your profile to stand out in the community'
      ],
      demo: (
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
            <div>
              <div className="text-white font-semibold">Your Name</div>
              <div className="text-slate-400 text-sm">@username</div>
            </div>
          </div>
          <div className="text-slate-300 text-sm">Click the profile icon to access settings</div>
        </div>
      )
    },
    {
      title: 'Account Setup',
      description: 'Complete your account setup by adding essential information and verifying your email address.',
      keyPoints: [
        'Add a profile picture to personalize your account',
        'Write a bio to tell others about yourself',
        'Verify your email for enhanced security'
      ],
      practice: 'Try updating your profile picture and bio now!'
    },
    {
      title: 'Privacy Settings',
      description: 'Control who can see your information and how your data is used on the platform.',
      keyPoints: [
        'Choose who can view your voting history',
        'Control notification preferences',
        'Manage data sharing settings'
      ],
      demo: (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
            <span className="text-white">Public Profile</span>
            <div className="w-12 h-6 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
            <span className="text-white">Show Voting History</span>
            <div className="w-12 h-6 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      )
    },
    {
      title: 'Personalization Options',
      description: 'Customize your experience with themes, preferences, and display settings.',
      keyPoints: [
        'Choose your preferred theme (light/dark)',
        'Set your content preferences',
        'Customize notification settings'
      ]
    },
    {
      title: 'Profile Complete!',
      description: 'Congratulations! You\'ve learned how to manage your profile. Your account is now fully set up and ready to use.',
      keyPoints: [
        'You can always update your profile from the settings menu',
        'Keep your information current for the best experience',
        'Explore other tutorials to learn more features'
      ]
    }
  ];

  return (
    <InteractiveTutorialEngine
      steps={steps}
      onComplete={onComplete}
      onExit={onExit}
      title="Profile Menu Tutorial"
      icon="👤"
    />
  );
};

export default ProfileMenuTutorial;