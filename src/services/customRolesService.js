/**
 * Custom roles service - foundation for admin-defined roles.
 * Uses admin_roles and user_admin_roles tables.
 * Keep in sync with Mobile when adding mobile support.
 */

import { supabase } from '../lib/supabase';

/** Fetch all custom admin roles */
export async function getAdminRoles() {
  const { data, error } = await supabase
    ?.from('admin_roles')
    ?.select('*')
    ?.order('display_name');
  if (error) throw error;
  return data ?? [];
}

/** Fetch roles assigned to a user */
export async function getUserAdminRoles(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    ?.from('user_admin_roles')
    ?.select(`
      role_id,
      admin_roles (
        id,
        role_name,
        display_name,
        description,
        permissions
      )
    `)
    ?.eq('user_id', userId);
  if (error) throw error;
  return data ?? [];
}

/** Check if user has a specific custom role by name */
export async function userHasCustomRole(userId, roleName) {
  const roles = await getUserAdminRoles(userId);
  return roles?.some(
    (r) => r?.admin_roles?.role_name === roleName
  );
}

/** Assign role to user (admin only - enforced by RLS) */
export async function assignRoleToUser(userId, roleId) {
  const { data, error } = await supabase
    ?.from('user_admin_roles')
    ?.upsert(
      { user_id: userId, role_id: roleId },
      { onConflict: 'user_id,role_id' }
    )
    ?.select();
  if (error) throw error;
  return data;
}

/** Remove role from user */
export async function removeRoleFromUser(userId, roleId) {
  const { error } = await supabase
    ?.from('user_admin_roles')
    ?.delete()
    ?.eq('user_id', userId)
    ?.eq('role_id', roleId);
  if (error) throw error;
}

export const customRolesService = {
  getAdminRoles,
  getUserAdminRoles,
  userHasCustomRole,
  assignRoleToUser,
  removeRoleFromUser,
};
