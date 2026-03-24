import { supabase } from '../lib/supabase';

// Password validation helper
const validatePassword = (password) => {
  const errors = [];

  if (password?.length < 12) {
    errors?.push('Password must be at least 12 characters long');
  }
  if (!/[A-Z]/?.test(password)) {
    errors?.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/?.test(password)) {
    errors?.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/?.test(password)) {
    errors?.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/?.test(password)) {
    errors?.push('Password must contain at least one special character');
  }

  // Check common passwords
  const commonPasswords = [
    'password123!', 'admin123!', 'welcome123!',
    'qwerty123!', '123456789!', 'password1!'
  ];
  if (commonPasswords?.includes(password?.toLowerCase())) {
    errors?.push('Password is too common. Please choose a stronger password');
  }

  return errors;
};

export const authService = {
  async signInPasskeyFirst(emailOrUsername, password, options = {}) {
    const passkeyFirst = options?.passkeyFirst !== false;
    const allowPasswordFallback = options?.allowPasswordFallback !== false;
    if (!passkeyFirst) {
      return this.signIn(emailOrUsername, password);
    }

    const passkeyAttempt = await this.signInWithPasskey();
    if (!passkeyAttempt?.error) {
      return passkeyAttempt;
    }
    if (!allowPasswordFallback) {
      return {
        data: null,
        error: { message: 'Passkey authentication required before password fallback' },
      };
    }
    return this.signIn(emailOrUsername, password);
  },

  async signUp(email, password, userData = {}) {
    try {
      // Validate password on client-side first
      const passwordErrors = validatePassword(password);
      if (passwordErrors?.length > 0) {
        throw new Error(passwordErrors.join('. '));
      }

      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || '',
            username: userData?.username || email?.split('@')?.[0],
            avatar_url: userData?.avatarUrl || '',
            role: 'user',
            interests: userData?.interests || [],
            languages: userData?.languages || []
          }
        }
      });
      
      if (error) throw error;

      // Log security event
      if (data?.user) {
        await supabase?.rpc('log_security_event', {
          p_event_type: 'user_signup',
          p_user_id: data?.user?.id,
          p_details: { email },
          p_severity: 'info'
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Sign up failed' } };
    }
  },

  async signIn(emailOrUsername, password) {
    try {
      let email = emailOrUsername;

      // If input doesn't contain @, lookup username
      if (!emailOrUsername?.includes('@')) {
        const { data: profile } = await supabase?.from('user_profiles')
          ?.select('email')
          ?.eq('username', emailOrUsername)
          ?.single();

        if (!profile?.email) {
          // SECURITY FIX: Generic error message to prevent username enumeration
          await supabase?.rpc('record_login_attempt', {
            p_email: emailOrUsername,
            p_success: false,
            p_failure_reason: 'invalid_credentials'
          });
          throw new Error('Invalid credentials');
        }
        email = profile?.email;
      }

      // Check for account lockout
      try {
        await supabase?.rpc('check_account_lockout', { p_email: email });
      } catch (lockoutError) {
        throw new Error(lockoutError.message);
      }

      // Attempt sign in
      const result = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (result?.error) {
        // Record failed attempt
        await supabase?.rpc('record_login_attempt', {
          p_email: email,
          p_success: false,
          p_failure_reason: 'invalid_credentials'
        });
        // SECURITY FIX: Generic error message
        throw new Error('Invalid credentials');
      }

      // Record successful attempt
      await supabase?.rpc('record_login_attempt', {
        p_email: email,
        p_success: true
      });

      return { data: result?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Invalid credentials' } };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Sign out failed' } };
    }
  },

  async resetPassword(email) {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Password reset failed' } };
    }
  },

  async signInWithPasskey() {
    try {
      const { startAuthentication } = await import('@simplewebauthn/browser');
      
      // Get authentication options from server
      const { data: options, error: optionsError } = await supabase
        ?.functions
        ?.invoke('passkey-auth-options');
      
      if (optionsError) throw optionsError;
      
      // Start WebAuthn authentication
      const authResponse = await startAuthentication(options);
      
      // Verify with Supabase
      const { data, error } = await supabase
        ?.functions
        ?.invoke('passkey-verify', { body: authResponse });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Passkey authentication failed' } };
    }
  },

  async registerPasskey(userId) {
    try {
      const { startRegistration } = await import('@simplewebauthn/browser');
      
      // Get registration options from server
      const { data: options, error: optionsError } = await supabase
        ?.functions
        ?.invoke('passkey-register-options', { body: { userId } });
      
      if (optionsError) throw optionsError;
      
      // Start WebAuthn registration
      const regResponse = await startRegistration(options);
      
      // Save credential to Supabase
      const { data, error } = await supabase
        ?.functions
        ?.invoke('passkey-register-verify', { body: { userId, credential: regResponse } });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Passkey registration failed' } };
    }
  },

  async signInWithMagicLink(email) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location?.origin}/home-feed-dashboard`
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Magic link failed' } };
    }
  },

  async signInWithOAuth(provider) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location?.origin}/home-feed-dashboard`
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'OAuth authentication failed' } };
    }
  },

  async signInWithEnterpriseSSO({ domain, providerId, redirectTo }) {
    try {
      const callbackUrl = redirectTo || `${window.location?.origin}/auth/callback`;
      const payload = {
        options: {
          redirectTo: callbackUrl,
        },
      };
      if (domain) payload.domain = domain;
      if (providerId) payload.providerId = providerId;

      const { data, error } = await supabase?.auth?.signInWithSSO(payload);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Enterprise SSO authentication failed' } };
    }
  },

  async updateAuthPreferences(preferences) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update({
          preferred_auth_methods: preferences?.preferredAuthMethods,
          magic_link_enabled: preferences?.magicLinkEnabled,
          oauth_providers: preferences?.oauthProviders
        })
        ?.eq('id', user?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};