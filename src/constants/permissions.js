/**
 * Granular permission constants for RBAC.
 */
export const PERMISSIONS = {
  // Election Permissions
  ELECTIONS_VIEW: 'elections:view',
  ELECTIONS_CREATE: 'elections:create',
  ELECTIONS_EDIT: 'elections:edit',
  ELECTIONS_DELETE: 'elections:delete',
  ELECTIONS_MANAGE_ROLLS: 'elections:manage_rolls',
  
  // Voting Permissions
  VOTE_CAST: 'vote:cast',
  VOTE_VIEW_RESULTS: 'vote:view_results',
  VOTE_AUDIT: 'vote:audit',
  
  // Campaign/Ad Permissions
  CAMPAIGNS_VIEW: 'campaigns:view',
  CAMPAIGNS_CREATE: 'campaigns:create',
  CAMPAIGNS_MANAGE: 'campaigns:manage',
  
  // Admin Permissions
  ADMIN_DASHBOARD_VIEW: 'admin:dashboard_view',
  ADMIN_MANAGE_USERS: 'admin:manage_users',
  ADMIN_MANAGE_ROLES: 'admin:manage_roles',
  ADMIN_VIEW_LOGS: 'admin:view_logs',
  ADMIN_CONFIGURE_SYSTEM: 'admin:configure_system',
  
  // Finance Permissions
  PAYMENTS_VIEW: 'payments:view',
  PAYMENTS_MANAGE: 'payments:manage',
  PAYOUTS_APPROVE: 'payouts:approve',
  
  // Profile Permissions
  PROFILE_VIEW: 'profile:view',
  PROFILE_EDIT: 'profile:edit',
};

/**
 * Mapping of Roles to Permissions.
 * Note: Admin and Super Admin inherit all permissions by default in the service logic.
 */
export const ROLE_PERMISSIONS = {
  voter: [
    PERMISSIONS.ELECTIONS_VIEW,
    PERMISSIONS.VOTE_CAST,
    PERMISSIONS.VOTE_VIEW_RESULTS,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
  ],
  creator: [
    PERMISSIONS.ELECTIONS_VIEW,
    PERMISSIONS.ELECTIONS_CREATE,
    PERMISSIONS.ELECTIONS_EDIT,
    PERMISSIONS.ELECTIONS_DELETE,
    PERMISSIONS.ELECTIONS_MANAGE_ROLLS,
    PERMISSIONS.VOTE_CAST,
    PERMISSIONS.VOTE_VIEW_RESULTS,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
  ],
  advertiser: [
    PERMISSIONS.ELECTIONS_VIEW,
    PERMISSIONS.CAMPAIGNS_VIEW,
    PERMISSIONS.CAMPAIGNS_CREATE,
    PERMISSIONS.CAMPAIGNS_MANAGE,
    PERMISSIONS.VOTE_CAST,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
  ],
  moderator: [
    PERMISSIONS.ELECTIONS_VIEW,
    PERMISSIONS.VOTE_VIEW_RESULTS,
    PERMISSIONS.ADMIN_DASHBOARD_VIEW,
    PERMISSIONS.ADMIN_VIEW_LOGS,
    PERMISSIONS.PROFILE_VIEW,
  ],
  manager: [
    PERMISSIONS.ELECTIONS_VIEW,
    PERMISSIONS.VOTE_VIEW_RESULTS,
    PERMISSIONS.ADMIN_DASHBOARD_VIEW,
    PERMISSIONS.ADMIN_MANAGE_USERS,
    PERMISSIONS.ADMIN_VIEW_LOGS,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PROFILE_VIEW,
  ],
  // Admin automatically gets all in permissionService.js
  admin: [],
  super_admin: [],
};
