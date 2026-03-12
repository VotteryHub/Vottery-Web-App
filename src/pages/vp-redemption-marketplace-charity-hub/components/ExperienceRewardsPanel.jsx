import React, { useState } from 'react';
import { Video, Users, Star, Calendar, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';
import Icon from '../../../components/AppIcon';


const ExperienceRewardsPanel = ({ vpBalance, onRedemption }) => {
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const experiences = [
    {
      id: 'webinar-premium',
      title: 'Premium Webinar Access',
      description: 'Exclusive access to expert-led webinars on voting systems, democracy, and civic engagement',
      icon: Video,
      vpCost: 600,
      availability: 'Available',
      features: ['Live Q&A sessions', 'Downloadable resources', 'Certificate of completion', 'Networking opportunities'],
      color: 'blue',
      upcoming: '3 webinars this month'
    },
    {
      id: 'creator-meetup',
      title: 'Creator Meet & Greet',
      description: 'Virtual meet-and-greet with top election creators and community leaders',
      icon: Users,
      vpCost: 1200,
      availability: 'Limited slots',
      features: ['30-minute session', 'Ask questions directly', 'Exclusive insights', 'Photo opportunity'],
      color: 'purple',
      upcoming: 'Next session: Feb 15'
    },
    {
      id: 'vip-event',
      title: 'VIP Virtual Event Ticket',
      description: 'Premium access to exclusive Vottery community events and product launches',
      icon: Star,
      vpCost: 1500,
      availability: 'Available',
      features: ['Front-row virtual seat', 'Exclusive swag', 'Early feature access', 'VIP chat room'],
      color: 'yellow',
      upcoming: 'Monthly events'
    },
    {
      id: 'workshop-series',
      title: 'Workshop Series Pass',
      description: 'Access to comprehensive workshop series on election creation and community building',
      icon: Calendar,
      vpCost: 800,
      availability: 'Available',
      features: ['4-week program', 'Hands-on projects', 'Mentor support', 'Community access'],
      color: 'green',
      upcoming: 'Starts monthly'
    }
  ];

  const handleRedeem = async (experience) => {
    if (vpBalance < experience?.vpCost) {
      alert('Insufficient VP balance');
      return;
    }

    try {
      setProcessing(true);
      await platformGamificationService?.redeemVP({
        type: 'experience_reward',
        experienceId: experience?.id,
        vpAmount: experience?.vpCost
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onRedemption?.();
    } catch (error) {
      console.error('Redemption error:', error);
      alert('Redemption failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-300">Experience Unlocked!</p>
            <p className="text-sm text-green-700 dark:text-green-400">Check your email for access details and calendar invites.</p>
          </div>
        </div>
      )}
      {/* Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences?.map((experience) => {
          const Icon = experience?.icon;
          const canAfford = vpBalance >= experience?.vpCost;
          
          return (
            <div
              key={experience?.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`bg-gradient-to-r from-${experience?.color}-500 to-${experience?.color}-600 p-6`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{experience?.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-sm text-white/90">{experience?.vpCost} VP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">{experience?.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{experience?.upcoming}</span>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                    experience?.availability === 'Available' ?'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {experience?.availability}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">What's Included:</p>
                  {experience?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleRedeem(experience)}
                  disabled={processing || !canAfford}
                  className={`w-full font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    canAfford
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' :'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : canAfford ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Unlock Experience
                    </>
                  ) : (
                    `Need ${(experience?.vpCost - vpBalance)?.toLocaleString()} more VP`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceRewardsPanel;