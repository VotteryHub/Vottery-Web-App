import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';
import { sponsoredElectionsService } from '../../../services/sponsoredElectionsService';

const CampaignList = ({ data, onRefresh }) => {
  const [campaigns, setCampaigns] = useState(data || []);
  const [editCampaign, setEditCampaign] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCampaigns(data || []);
  }, [data]);

  const handlePauseCampaign = async (campaignId) => {
    try {
      await sponsoredElectionsService?.toggleSponsoredElectionStatus?.(campaignId, 'paused');
      setCampaigns(campaigns?.map(c => (c?.id === campaignId ? { ...c, status: 'paused' } : c)) ?? []);
      onRefresh?.();
    } catch (err) {
      console.error('Pause campaign failed:', err);
    }
  };

  const handleResumeCampaign = async (campaignId) => {
    try {
      await sponsoredElectionsService?.toggleSponsoredElectionStatus?.(campaignId, 'active');
      setCampaigns(campaigns?.map(c => (c?.id === campaignId ? { ...c, status: 'active' } : c)) ?? []);
      onRefresh?.();
    } catch (err) {
      console.error('Resume campaign failed:', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-success/10 text-success';
      case 'paused': return 'bg-warning/10 text-warning';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleEditClick = (campaign) => {
    setEditCampaign(campaign);
    setEditForm({ title: campaign?.title ?? '', description: campaign?.description ?? '' });
  };

  const handleEditSave = async () => {
    if (!editCampaign?.id) return;
    setSaving(true);
    try {
      if (editCampaign?.election_id && (editForm?.title != null || editForm?.description != null)) {
        const electionUpdates = {};
        if (editForm?.title != null) electionUpdates.title = editForm.title;
        if (editForm?.description != null) electionUpdates.description = editForm.description;
        if (Object.keys(electionUpdates).length > 0) {
          await supabase?.from('elections')?.update(electionUpdates)?.eq('id', editCampaign.election_id);
        }
      }
      setCampaigns(campaigns?.map(c => (c?.id === editCampaign?.id ? { ...c, ...editForm } : c)) ?? []);
      setEditCampaign(null);
      onRefresh?.();
    } catch (err) {
      console.error('Campaign update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Campaign List
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage individual sponsored election campaigns
          </p>
        </div>
        <Icon name="List" size={24} className="text-primary" />
      </div>

      <div className="space-y-4">
        {campaigns?.map((campaign) => (
          <div key={campaign?.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading font-semibold text-foreground text-lg">
                    {campaign?.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign?.status)}`}>
                    {campaign?.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {campaign?.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Participation Rate</p>
                    <p className="text-lg font-heading font-bold text-foreground font-data">
                      {campaign?.participationRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
                    <p className="text-lg font-heading font-bold text-foreground font-data">
                      ${campaign?.spend?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                    <p className="text-lg font-heading font-bold text-foreground font-data">
                      {campaign?.engagement?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cost/Engagement</p>
                    <p className="text-lg font-heading font-bold text-foreground font-data">
                      ${campaign?.costPerEngagement}
                    </p>
                  </div>
                  {campaign?.roi != null && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ROI</p>
                      <p className="text-lg font-heading font-bold text-foreground font-data">
                        {campaign?.roi}%
                      </p>
                    </div>
                  )}
                </div>
                {campaign?.zone_breakdown && Object.keys(campaign.zone_breakdown).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Reach by zone (8 regions)</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(campaign.zone_breakdown).slice(0, 8).map(([zoneId, val]) => (
                        <span key={zoneId} className="px-2 py-0.5 rounded bg-muted/50 text-xs font-data">
                          Z{zoneId}: {typeof val === 'object' && val != null && 'reach' in val ? (val.reach ?? val.participants ?? 0) : Number(val) ?? 0}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {campaign?.status === 'active' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Pause"
                    onClick={() => handlePauseCampaign(campaign?.id)}
                  >
                    Pause
                  </Button>
                ) : campaign?.status === 'paused' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Play"
                    onClick={() => handleResumeCampaign(campaign?.id)}
                  >
                    Resume
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  onClick={() => handleEditClick(campaign)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !saving && setEditCampaign(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Edit campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Title</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  value={editForm?.title ?? ''}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground min-h-[80px]"
                  value={editForm?.description ?? ''}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={() => setEditCampaign(null)} disabled={saving}>Cancel</Button>
              <Button size="sm" onClick={handleEditSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignList;