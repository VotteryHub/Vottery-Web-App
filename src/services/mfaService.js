import { supabase } from '../lib/supabase';

export const mfaService = {
  /**
   * Setup MFA for user account
   * @returns {Promise<object>} { secret, qrCode, backupCodes }
   */
  async setupMFA() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Call Edge Function to generate MFA secret
      const { data, error } = await supabase?.functions?.invoke('mfa-setup', {
        body: { userId: user?.id }
      });

      if (error) throw error;

      return {
        secret: data?.secret,
        qrCode: data?.qrCode,
        backupCodes: data?.backupCodes,
        error: null
      };
    } catch (error) {
      return {
        secret: null,
        qrCode: null,
        backupCodes: null,
        error: { message: error?.message }
      };
    }
  },

  /**
   * Verify MFA token and enable MFA
   * @param {string} token - 6-digit TOTP token
   * @returns {Promise<object>}
   */
  async verifyAndEnableMFA(token) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.functions?.invoke('mfa-verify', {
        body: { userId: user?.id, token }
      });

      if (error) throw error;

      // Log security event
      await supabase?.rpc('log_security_event', {
        p_event_type: 'mfa_enabled',
        p_user_id: user?.id,
        p_severity: 'info'
      });

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  /**
   * Verify MFA token during login
   * @param {string} token - 6-digit TOTP token or backup code
   * @returns {Promise<boolean>}
   */
  async verifyMFAToken(token) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.functions?.invoke('mfa-verify', {
        body: { userId: user?.id, token }
      });

      if (error) throw error;

      return data?.valid || false;
    } catch (error) {
      console.error('MFA verification error:', error);
      return false;
    }
  },

  /**
   * Disable MFA for user account
   * @param {string} password - User password for confirmation
   * @returns {Promise<object>}
   */
  async disableMFA(password) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Verify password first
      const { error: authError } = await supabase?.auth?.signInWithPassword({
        email: user?.email,
        password
      });

      if (authError) throw new Error('Invalid password');

      // Disable MFA
      const { error } = await supabase?.from('mfa_secrets')?.update({ enabled: false })?.eq('user_id', user?.id);

      if (error) throw error;

      // Log security event
      await supabase?.rpc('log_security_event', {
        p_event_type: 'mfa_disabled',
        p_user_id: user?.id,
        p_severity: 'warning'
      });

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  /**
   * Check if MFA is enabled for user
   * @returns {Promise<boolean>}
   */
  async isMFAEnabled() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return false;

      const { data, error } = await supabase?.from('mfa_secrets')?.select('enabled')?.eq('user_id', user?.id)?.single();

      if (error) return false;
      return data?.enabled || false;
    } catch (error) {
      return false;
    }
  },

  /**
   * Regenerate backup codes
   * @returns {Promise<object>}
   */
  async regenerateBackupCodes() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.functions?.invoke('mfa-regenerate-backup-codes', {
        body: { userId: user?.id }
      });

      if (error) throw error;

      // Log security event
      await supabase?.rpc('log_security_event', {
        p_event_type: 'mfa_backup_codes_regenerated',
        p_user_id: user?.id,
        p_severity: 'info'
      });

      return { backupCodes: data?.backupCodes, error: null };
    } catch (error) {
      return { backupCodes: null, error: { message: error?.message } };
    }
  }
};