import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { analytics } from '../../../hooks/useGoogleAnalytics';
import { supabase } from '../../../lib/supabase';
import { CAMPAIGN_MANAGEMENT_DASHBOARD_ROUTE } from '../../../constants/navigationHubRoutes';

const mapRowsToCampaigns = (rows, titleByElectionId = {}) =>
  (rows || []).map((row) => {
    const eid = row?.election_id;
    const title =
      (eid && titleByElectionId[eid]) ||
      (eid ? `Election ${String(eid).slice(0, 8)}…` : `Campaign ${String(row?.id || '').slice(0, 8)}`);
    const rawStatus = (row?.status || 'active').toString().toLowerCase();
    const status = rawStatus === 'paused' ? 'paused' : 'active';
    return {
      id: row.id,
      title,
      status,
      participants: Number(row?.total_engagements ?? 0),
      spend: Number(row?.budget_spent ?? 0),
    };
  });

const CampaignEmergencyControls = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const loadActiveCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sponsored_elections')
        .select('id,election_id,status,budget_spent,total_engagements,updated_at')
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      const electionIds = [...new Set((data || []).map((r) => r?.election_id).filter(Boolean))];
      let titleByElectionId = {};
      if (electionIds.length > 0) {
        const { data: elections, error: eErr } = await supabase
          .from('elections')
          .select('id,title')
          .in('id', electionIds);
        if (!eErr && elections?.length) {
          titleByElectionId = Object.fromEntries(
            elections.map((e) => [e.id, e.title])
          );
        }
      }
      setCampaigns(mapRowsToCampaigns(data, titleByElectionId));
    } catch (err) {
      console.error('loadActiveCampaigns:', err);
      toast.error(err?.message || 'Could not load sponsored campaigns');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveCampaigns();
  }, [loadActiveCampaigns]);

  const handlePauseCampaign = async (campaignId) => {
    try {
      setProcessing(campaignId);
      const { error } = await supabase
        .from('sponsored_elections')
        .update({ status: 'paused', updated_at: new Date().toISOString() })
        .eq('id', campaignId);
      if (error) throw error;
      analytics?.trackEvent('emergency_campaign_pause', {
        campaign_id: campaignId,
        device_type: 'mobile',
        action_type: 'emergency_control',
      });
      toast.success('Campaign paused');
      await loadActiveCampaigns();
      await onRefresh?.();
    } catch (err) {
      console.error('Failed to pause campaign:', err);
      toast.error(err?.message || 'Pause failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleResumeCampaign = async (campaignId) => {
    try {
      setProcessing(campaignId);
      const { error } = await supabase
        .from('sponsored_elections')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', campaignId);
      if (error) throw error;
      analytics?.trackEvent('emergency_campaign_resume', {
        campaign_id: campaignId,
        device_type: 'mobile',
        action_type: 'emergency_control',
      });
      toast.success('Campaign resumed');
      await loadActiveCampaigns();
      await onRefresh?.();
    } catch (err) {
      console.error('Failed to resume campaign:', err);
      toast.error(err?.message || 'Resume failed');
    } finally {
      setProcessing(null);
    }
  };

  const handlePauseAll = async () => {
    const activeIds = campaigns.filter((c) => c.status === 'active').map((c) => c.id);
    if (!activeIds.length) {
      toast('No active campaigns to pause');
      return;
    }
    try {
      setProcessing('all');
      const { error } = await supabase
        .from('sponsored_elections')
        .update({ status: 'paused', updated_at: new Date().toISOString() })
        .in('id', activeIds);
      if (error) throw error;
      analytics?.trackEvent('emergency_campaign_pause_all', {
        count: activeIds.length,
        device_type: 'mobile',
        action_type: 'emergency_control',
      });
      toast.success(`Paused ${activeIds.length} campaign(s)`);
      await loadActiveCampaigns();
      await onRefresh?.();
    } catch (err) {
      console.error('Failed to pause all campaigns:', err);
      toast.error(err?.message || 'Pause all failed');
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
          disabled={processing === 'all' || loading}
        >
          Pause All
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading sponsored campaigns…</p>
      ) : campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No sponsored election campaigns found. Data comes from{' '}
          <code className="text-xs">sponsored_elections</code>.
        </p>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign?.id} className="p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {campaign?.title}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        campaign?.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {campaign?.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={12} />
                      {campaign?.participants?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="DollarSign" size={12} />$
                      {campaign?.spend?.toLocaleString()}
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
                  type="button"
                  onClick={() => navigate(CAMPAIGN_MANAGEMENT_DASHBOARD_ROUTE)}
                >
                  Stats
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignEmergencyControls;
