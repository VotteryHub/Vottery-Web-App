import { supabase } from '../lib/supabase.js';

/**
 * Middleware to require a specific role.
 * @param {string[]} allowedRoles - Array of roles allowed to access the route.
 */
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' });
      }

      // Verify token with Supabase
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      // Fetch user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return res.status(403).json({ error: 'User profile not found' });
      }

      const userRole = profile.role.toLowerCase();

      // Admin bypass
      if (['admin', 'super_admin'].includes(userRole)) {
        return next();
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: 'Access denied: insufficient role' });
      }

      // Attach user/profile to request
      req.user = user;
      req.userProfile = profile;
      next();
    } catch (error) {
      console.error('[RBAC] Middleware error:', error);
      res.status(500).json({ error: 'Internal server error during authorization' });
    }
  };
};

/**
 * Middleware to require a specific permission.
 * Maps permissions to roles based on the same logic as the frontend.
 */
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' });
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return res.status(403).json({ error: 'User profile not found' });
      }

      const userRole = profile.role.toLowerCase();

      // Admin bypass
      if (['admin', 'super_admin'].includes(userRole)) {
        return next();
      }

      // Simple permission mapping for backend (Sync with permissions.js logic)
      const rolePermissions = {
        voter: ['elections:view', 'vote:cast', 'vote:view_results'],
        creator: ['elections:view', 'elections:create', 'elections:edit', 'elections:manage_rolls', 'vote:cast'],
        advertiser: ['elections:view', 'campaigns:view', 'campaigns:create', 'campaigns:manage', 'vote:cast'],
        moderator: ['elections:view', 'admin:dashboard_view', 'admin:view_logs'],
        manager: ['elections:view', 'admin:dashboard_view', 'admin:manage_users', 'admin:view_logs', 'payments:view'],
      };

      const allowedPermissions = rolePermissions[userRole] || [];
      
      if (!allowedPermissions.includes(permission)) {
        return res.status(403).json({ error: `Access denied: missing permission '${permission}'` });
      }

      req.user = user;
      req.userProfile = profile;
      next();
    } catch (error) {
      console.error('[RBAC] Permission Middleware error:', error);
      res.status(500).json({ error: 'Internal server error during authorization' });
    }
  };
};
