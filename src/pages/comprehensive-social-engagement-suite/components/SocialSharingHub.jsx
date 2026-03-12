import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import { socialSharingService } from '../../../services/socialSharingService';

const SocialSharingHub = ({ election }) => {
  const [shareStats, setShareStats] = useState({
    whatsapp: 0,
    facebook: 0,
    twitter: 0,
    linkedin: 0,
    telegram: 0,
    total: 0
  });
  const [showCustomMessage, setShowCustomMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const shareUrl = election?.electionUrl || `https://vottery.com/vote/${election?.uniqueElectionId}`;
  const defaultMessage = `Vote in "${election?.title}"! ${election?.isLotterized ? `Win prizes worth ${election?.prizePool}!` : ''} Join now:`;

  const handleShare = async (platform) => {
    const message = customMessage || defaultMessage;
    const success = await socialSharingService?.share(platform, shareUrl, message, election?.title);
    
    if (success) {
      setShareStats(prev => ({
        ...prev,
        [platform]: prev?.[platform] + 1,
        total: prev?.total + 1
      }));
      
      // Track share in database
      await socialSharingService?.trackShare({
        contentType: 'election',
        contentId: election?.id,
        platform,
        shareUrl
      });
    }
  };

  const platforms = [
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: 'MessageCircle', 
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: 'Facebook', 
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: 'Twitter', 
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-white'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: 'Linkedin', 
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-white'
    },
    { 
      id: 'telegram', 
      name: 'Telegram', 
      icon: 'Send', 
      color: 'bg-sky-400 hover:bg-sky-500',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Share2" size={28} className="text-primary" />
          Social Sharing Hub
        </h2>
        <p className="text-muted-foreground mb-6">
          Share this election across social platforms with customizable messages and track viral reach
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Share2" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Shares</p>
                <p className="text-xl font-data font-bold text-foreground">{shareStats?.total}</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} color="var(--color-success)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Viral Coefficient</p>
                <p className="text-xl font-data font-bold text-foreground">
                  {election?.totalVoters > 0 ? (shareStats?.total / election?.totalVoters)?.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={20} color="var(--color-accent)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Potential Reach</p>
                <p className="text-xl font-data font-bold text-foreground">
                  {(shareStats?.total * 150)?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Share Message</label>
            <button
              onClick={() => setShowCustomMessage(!showCustomMessage)}
              className="text-xs text-primary hover:underline"
            >
              {showCustomMessage ? 'Use Default' : 'Customize'}
            </button>
          </div>
          
          {showCustomMessage ? (
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e?.target?.value)}
              placeholder={defaultMessage}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          ) : (
            <div className="p-4 bg-muted rounded-lg border border-border">
              <p className="text-sm text-foreground">{defaultMessage}</p>
              <p className="text-xs text-muted-foreground mt-2">{shareUrl}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {platforms?.map((platform) => (
            <button
              key={platform?.id}
              onClick={() => handleShare(platform?.id)}
              className={`${platform?.color} ${platform?.textColor} p-4 rounded-lg transition-all duration-250 hover:scale-105 hover:shadow-lg`}
            >
              <Icon name={platform?.icon} size={24} className="mx-auto mb-2" />
              <p className="text-sm font-medium">{platform?.name}</p>
              <p className="text-xs opacity-80 mt-1">{shareStats?.[platform?.id]} shares</p>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          Share Analytics
        </h3>
        <div className="space-y-3">
          {platforms?.map((platform) => {
            const percentage = shareStats?.total > 0 ? (shareStats?.[platform?.id] / shareStats?.total * 100) : 0;
            return (
              <div key={platform?.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon name={platform?.icon} size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{platform?.name}</span>
                  </div>
                  <span className="text-sm font-data font-semibold text-foreground">
                    {shareStats?.[platform?.id]} ({percentage?.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SocialSharingHub;