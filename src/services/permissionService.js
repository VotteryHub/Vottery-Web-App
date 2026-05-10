import { ROLE_PERMISSIONS, PERMISSIONS } from '../constants/permissions';
import { supabase } from '../lib/supabase';

/**
 * Single source of truth for permission checks.
 */
export const permissionService = {
  /**
   * Check if a user has a specific permission.
   * @param {Object} userProfile - The user profile object containing the 'role' field.
   * @param {string} permission - The permission constant from PERMISSIONS.
   * @param {Object} context - Optional context for object-level checks (e.g., { ownerId: '...' }).
   * @returns {boolean}
   */
  can(userProfile, permission, context = null) {
    if (!userProfile?.role) return false;

    let role = userProfile.role.toLowerCase();
    
    // Database to Frontend role mapping
    if (role === 'user') role = 'voter';
    if (role === 'brand') role = 'advertiser';

    // 1. Admin/Super Admin bypass
    if (['admin', 'super_admin'].includes(role)) return true;

    // 2. Check Role-based permissions
    const allowedPermissions = ROLE_PERMISSIONS[role] || [];
    const hasRolePermission = allowedPermissions.includes(permission);

    // 3. Contextual/Ownership checks
    if (context?.ownerId && userProfile.id === context.ownerId) {
      // Owners can generally edit/manage their own assets if their role allows creating them
      if (
        (permission === PERMISSIONS.ELECTIONS_EDIT || permission === PERMISSIONS.ELECTIONS_DELETE) &&
        role === 'creator'
      ) {
        return true;
      }
      if (
        (permission === PERMISSIONS.CAMPAIGNS_MANAGE) &&
        role === 'advertiser'
      ) {
        return true;
      }
    }

    return hasRolePermission;
  },

  /**
   * Async check for asset-specific permissions (e.g., election ownership).
   * Useful when we only have an asset ID and need to fetch the owner.
   */
  async canAccessAsset(user, permission, assetType, assetId) {
    if (!user || !assetId) return false;

    // First fetch the profile to get the role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return false;

    // Admins always win
    if (this.can(profile, PERMISSIONS.ADMIN_DASHBOARD_VIEW)) return true;

    // For specific asset types, check ownership
    if (assetType === 'election') {
      const { data: election } = await supabase
        .from('elections')
        .select('created_by')
        .eq('id', assetId)
        .single();
      
      return this.can(profile, permission, { ownerId: election?.created_by });
    }

    if (assetType === 'campaign') {
      const { data: campaign } = await supabase
        .from('sponsored_elections')
        .select('advertiser_id')
        .eq('id', assetId)
        .single();
      
      return this.can(profile, permission, { ownerId: campaign?.advertiser_id });
    }

    return this.can(profile, permission);
  }
};

export default permissionService;
