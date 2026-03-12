import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const CampaignEmergencyControls = ({ onRefresh }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadActiveCampaigns();
  }, []);

  const loadActiveCampaigns = () => {
    // Mock data - would come from campaign service
    setCampaigns([
      {
        id: '1',
        title: 'Presidential Election 2026',
        status: 'active',
        participants: 15234,
        spend: 45000
      },
      {
        id: '2',
        title: 'City Council Vote',
        status: 'active',
        participants: 8921,
        spend: 12000
      },
      {
        id: '3',
        title: 'Community Survey',
        status: 'paused',
        participants: 3456,
        spend: 5000
      }
    ]);
  };

  const handlePauseCampaign = async (campaignId) => {
    try {
      setProcessing(campaignId);
      // Pause campaign logic here
      
      // Track campaign pause action
      analytics?.trackEvent('emergency_campaign_pause', {
        campaign_id: campaignId,
        device_type: 'mobile',
        action_type: 'emergency_control'
      });
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to pause campaign:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleResumeCampaign = async (campaignId) => {
    try {
      setProcessing(campaignId);
      // Resume campaign logic here
      
      // Track campaign resume action
      analytics?.trackEvent('emergency_campaign_resume', {
        campaign_id: campaignId,
        device_type: 'mobile',
        action_type: 'emergency_control'
      });
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to resume campaign:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handlePauseAll = async () => {
    try {
      setProcessing('all');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCampaigns(campaigns?.map(c => ({ ...c, status: 'paused' })));
      await onRefresh();
    } catch (err) {
      console.error('Failed to pause all campaigns:', err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-base font-heading font-semibold text-foreground">
            Campaign Controls
          </h3>
        </div>
        <Button
          variant="destructive"
          size="sm"
          iconName="PauseCircle"
          onClick={handlePauseAll}
          disabled={processing === 'all'}
        >
          Pause All
        </Button>
      </div>

      <div className="space-y-3">
        {campaigns?.map((campaign) => (
          <div key={campaign?.id} className="p-4 rounded-lg border border-border">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {campaign?.title}
                  </p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    campaign?.status === 'active' ?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {campaign?.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Users" size={12} />
                    {campaign?.participants?.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="DollarSign" size={12} />
                    ${campaign?.spend?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {campaign?.status === 'active' ? (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Pause"
                  onClick={() => handlePauseCampaign(campaign?.id)}
                  disabled={processing === campaign?.id}
                  className="flex-1"
                >
                  Pause
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  iconName="Play"
                  onClick={() => handleResumeCampaign(campaign?.id)}
                  disabled={processing === campaign?.id}
                  className="flex-1"
                >
                  Resume
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                iconName="BarChart3"
                className="flex-1"
              >
                Stats
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignEmergencyControls;