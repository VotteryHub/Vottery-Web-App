/**
 * Shared role constants for RBAC.
 * Keep in sync with Mobile: lib/constants/roles.dart
 */

export const ROLES = {
  VOTER: 'voter',
  CREATOR: 'creator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  MODERATOR: 'moderator',
  ADVERTISER: 'advertiser',
  DEVELOPER: 'developer',
};

/** Roles that have full admin access */
export const ADMIN_ROLES = [
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.MANAGER,
  ROLES.MODERATOR,
];

/** Roles that have creator access */
export const CREATOR_ROLES = [ROLES.CREATOR, ...ADMIN_ROLES];

/** Roles that have advertiser access */
export const ADVERTISER_ROLES = [ROLES.ADVERTISER, ...ADMIN_ROLES];

/**
 * Get effective roles for a user (admin-like roles get admin access)
 * Maps database enum values ('user', 'brand') to frontend constants ('voter', 'advertiser')
 */
export function getEffectiveRoles(role) {
  let r = role || ROLES.VOTER;
  
  // Database to Frontend mapping
  if (r === 'user') r = ROLES.VOTER;
  if (r === 'brand') r = ROLES.ADVERTISER;
  
  const roles = [r];
  if (ADMIN_ROLES.includes(r)) roles.push(ROLES.ADMIN);
  if ([ROLES.CREATOR, ...ADMIN_ROLES].includes(r)) roles.push(ROLES.CREATOR);
  if ([ROLES.ADVERTISER, ...ADMIN_ROLES].includes(r)) roles.push(ROLES.ADVERTISER);
  return [...new Set(roles)];
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(userRole, requiredRoles) {
  if (!requiredRoles?.length) return true;
  const effective = getEffectiveRoles(userRole);
  return requiredRoles.some((r) => effective.includes(r));
}

/** Check if role has admin access */
export function isAdminRole(role) {
  return hasAnyRole(role, ADMIN_ROLES);
}

/** Check if role has creator access */
export function isCreatorRole(role) {
  return hasAnyRole(role, CREATOR_ROLES);
}

/** Check if role has advertiser access */
export function isAdvertiserRole(role) {
  return hasAnyRole(role, ADVERTISER_ROLES);
}
