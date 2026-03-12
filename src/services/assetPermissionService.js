/**
 * Asset-level permission checks (scaffold).
 * Use for: election ownership, campaign ownership, etc.
 * Extend as needed for multi-tenant / org-level permissions.
 *
 * Keep in sync with Mobile when adding checks.
 */

import { supabase } from '../lib/supabase';
import { hasAnyRole } from '../constants/roles';

export const assetPermissionService = {
  /**
   * Check if user can access an election (creator, admin, or voter who can view).
   * @param {string} userId - auth user id
   * @param {string} electionId - election uuid
   * @param {string} action - 'view' | 'edit' | 'delete' | 'manage'
   */
  async canAccessElection(userId, electionId, action = 'view') {
    if (!userId || !electionId) return false;
    try {
      const { data: election, error } = await supabase
        ?.from('elections')
        ?.select('created_by, status')
        ?.eq('id', electionId)
        ?.single();
      if (error || !election) return false;
      const { data: profile } = await supabase
        ?.from('user_profiles')
        ?.select('role')
        ?.eq('id', userId)
        ?.single();
      const role = profile?.role || 'voter';
      if (election.created_by === userId) return true;
      if (hasAnyRole(role, ['admin', 'super_admin', 'manager', 'moderator'])) return true;
      if (action === 'view' && ['active', 'completed', 'upcoming'].includes(election?.status)) return true;
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Check if user can access a campaign (advertiser or admin).
   * @param {string} userId - auth user id
   * @param {string} campaignId - campaign uuid (if applicable)
   */
  async canAccessCampaign(userId, campaignId) {
    if (!userId) return false;
    try {
      const { data: profile } = await supabase
        ?.from('user_profiles')
        ?.select('role')
        ?.eq('id', userId)
        ?.single();
      const role = profile?.role || 'voter';
      if (hasAnyRole(role, ['advertiser', 'admin', 'super_admin', 'manager', 'moderator'])) return true;
      if (campaignId) {
        const { data: campaign } = await supabase
          ?.from('sponsored_elections')
          ?.select('advertiser_id')
          ?.eq('id', campaignId)
          ?.single();
        if (campaign?.advertiser_id === userId) return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};

export default assetPermissionService;
