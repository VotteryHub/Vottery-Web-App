import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { electionsService } from '../../../services/electionsService';

const ElectionCard = ({ election, onVote, onVerify, onEdit, onDelete, onExtend, onClone, isCreator }) => {
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [extendDays, setExtendDays] = useState(30);
  const [newRewardAmount, setNewRewardAmount] = useState(election?.rewardAmount || '');
  const [showEditReward, setShowEditReward] = useState(false);
  const [saving, setSaving] = useState(false);

  const voteCount = election?.voteCount || election?.vote_count || 0;
  const canEditDelete = isCreator && voteCount === 0;
  const canExtend = isCreator && voteCount > 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'upcoming': return 'bg-warning/10 text-warning';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'Activity';
      case 'upcoming': return 'Clock';
      case 'completed': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const handleExtendEndDate = async () => {
    if (!election?.id) return;
    setSaving(true);
    try {
      const currentEnd = new Date(election?.endDate || election?.end_date || Date.now());
      const newEnd = new Date(currentEnd.getTime() + extendDays * 24 * 60 * 60 * 1000);
      const { data, error } = await electionsService?.extendEndDate?.(election?.id, newEnd?.toISOString());
      if (error) throw new Error(error?.message);
      onExtend?.(election?.id, data?.endDate || data?.end_date || newEnd);
      setShowExtendModal(false);
    } catch (err) {
      console.error('Extend error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleClone = async () => {
    if (!election?.id) return;
    setCloning(true);
    try {
      const { data, error } = await electionsService?.clone(election?.id);
      if (error) throw new Error(error?.message);
      onClone?.(data?.id ?? data);
    } catch (err) {
      console.error('Clone error:', err);
    } finally {
      setCloning(false);
    }
  };

  const handleEditRewardAmount = async () => {
    if (!election?.id || !newRewardAmount) return;
    setSaving(true);
    try {
      await electionsService?.update(election?.id, { reward_amount: parseFloat(newRewardAmount) });
      onEdit?.(election?.id, { rewardAmount: parseFloat(newRewardAmount) });
      setShowEditReward(false);
    } catch (err) {
      console.error('Edit reward error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-4 md:p-6 hover:shadow-democratic-md transition-all duration-250">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-48 h-32 lg:h-auto overflow-hidden rounded-lg flex-shrink-0">
          <Image
            src={election?.coverImage}
            alt={election?.coverImageAlt || `Cover image for ${election?.title}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(election?.status)}`}>
                  <Icon name={getStatusIcon(election?.status)} size={12} className="inline mr-1" />
                  {election?.status?.charAt(0)?.toUpperCase() + election?.status?.slice(1)}
                </span>
                {election?.isLotterized && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    <Icon name="Trophy" size={12} className="inline mr-1" />
                    Lotterized
                  </span>
                )}
                {election?.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    {election?.category}
                  </span>
                )}
                {isCreator && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    voteCount === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {voteCount === 0 ? '✏️ Editable' : `🔒 ${voteCount} votes`}
                  </span>
                )}
              </div>
              <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2 line-clamp-2">
                {election?.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {election?.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="text-sm font-data font-medium text-foreground">{election?.participants}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Vote" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Votes</p>
                <p className="text-sm font-data font-medium text-foreground">{voteCount?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm font-data font-medium text-foreground">
                  {election?.endDate ? new Date(election.endDate)?.toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            {election?.rewardAmount && (
              <div className="flex items-center gap-2">
                <Icon name="DollarSign" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Reward</p>
                  <p className="text-sm font-data font-medium text-foreground">${election?.rewardAmount}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {election?.status === 'active' && (
              <Button variant="primary" size="sm" onClick={() => onVote?.(election?.id)}>
                <Icon name="Vote" size={14} className="mr-1" /> Vote Now
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onVerify?.(election?.id)}>
              <Icon name="Shield" size={14} className="mr-1" /> Verify
            </Button>

            {/* Creator Controls - Vote Count Based */}
            {canEditDelete && (
              <>
                <Button variant="outline" size="sm" onClick={() => onEdit?.(election?.id)} className="text-blue-600 border-blue-300 hover:bg-blue-50">
                  <Icon name="Edit" size={14} className="mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete?.(election?.id)} className="text-red-600 border-red-300 hover:bg-red-50">
                  <Icon name="Trash2" size={14} className="mr-1" /> Delete
                </Button>
              </>
            )}

            {isCreator && (
              <Button variant="outline" size="sm" onClick={handleClone} disabled={cloning} className="text-purple-600 border-purple-300 hover:bg-purple-50">
                <Icon name="Copy" size={14} className="mr-1" /> {cloning ? 'Cloning...' : 'Clone'}
              </Button>
            )}

            {canExtend && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowExtendModal(true)} className="text-indigo-600 border-indigo-300 hover:bg-indigo-50">
                  <Icon name="Calendar" size={14} className="mr-1" /> Extend Date
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowEditReward(true)} className="text-green-600 border-green-300 hover:bg-green-50">
                  <Icon name="DollarSign" size={14} className="mr-1" /> Edit Reward
                </Button>
              </>
            )}
          </div>

          {/* Extend End Date Modal */}
          {showExtendModal && (
            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
              <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-3">Extend End Date (max 6 months)</h4>
              <div className="flex items-center gap-3">
                <select
                  value={extendDays}
                  onChange={e => setExtendDays(Number(e?.target?.value))}
                  className="flex-1 p-2 border border-indigo-200 rounded-lg text-sm bg-white dark:bg-gray-800"
                >
                  <option value={7}>+7 days</option>
                  <option value={14}>+14 days</option>
                  <option value={30}>+30 days</option>
                  <option value={60}>+60 days</option>
                  <option value={90}>+90 days</option>
                  <option value={180}>+180 days (max)</option>
                </select>
                <Button size="sm" onClick={handleExtendEndDate} disabled={saving}>
                  {saving ? 'Saving...' : 'Confirm'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowExtendModal(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Edit Reward Amount Modal */}
          {showEditReward && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
              <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3">Edit Reward Amount</h4>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={newRewardAmount}
                  onChange={e => setNewRewardAmount(e?.target?.value)}
                  placeholder="New reward amount ($)"
                  className="flex-1 p-2 border border-green-200 rounded-lg text-sm bg-white dark:bg-gray-800"
                />
                <Button size="sm" onClick={handleEditRewardAmount} disabled={saving}>
                  {saving ? 'Saving...' : 'Update'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowEditReward(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionCard;