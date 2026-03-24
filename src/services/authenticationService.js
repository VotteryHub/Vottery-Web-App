import { supabase } from '../lib/supabase';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { isSmsAllowedUseCase } from './notificationCostOptimizerService';

/**
 * Multi-Authentication Service
 * Supports: Passkey (WebAuthn), Magic Link, OAuth (Google, Apple, Facebook, Twitter), Email/Password
 */

class AuthenticationService {
  async signInPasskeyFirst({ email, password, allowPasswordFallback = true }) {
    const passkeyResult = await this.authenticateWithPasskey(email);
    if (passkeyResult?.success) return passkeyResult;
    if (!allowPasswordFallback) {
      return {
        success: false,
        error: passkeyResult?.error || 'Passkey authentication required',
      };
    }
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, user: data?.user };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }

  // ============ PASSKEY (WebAuthn) AUTHENTICATION ============
  
  async registerPasskey(userId, email) {
    try {
      // Generate registration options from backend
      const { data: options, error } = await supabase?.functions?.invoke('generate-passkey-options', {
        body: { userId, email, type: 'registration' }
      });

      if (error) throw error;

      // Start WebAuthn registration
      const credential = await startRegistration(options);

      // Verify and store credential
      const { data, error: verifyError } = await supabase?.from('passkey_credentials')?.insert({
          user_id: userId,
          credential_id: credential?.id,
          public_key: credential?.response?.publicKey,
          counter: 0,
          device_type: this.detectDeviceType(),
          transports: credential?.response?.transports,
        })?.select()?.single();

      if (verifyError) throw verifyError;

      return { success: true, credential: data };
    } catch (error) {
      console.error('Passkey registration error:', error);
      return { success: false, error: error?.message };
    }
  }

  async authenticateWithPasskey(email) {
    try {
      // Get authentication options
      const { data: options, error } = await supabase?.functions?.invoke('generate-passkey-options', {
        body: { email, type: 'authentication' }
      });

      if (error) throw error;

      // Start WebAuthn authentication
      const credential = await startAuthentication(options);

      // Verify credential and sign in
      const { data, error: authError } = await supabase?.auth?.signInWithPassword({
        email,
        password: credential?.response?.signature, // Use signature as proof
      });

      if (authError) throw authError;

      return { success: true, user: data?.user };
    } catch (error) {
      console.error('Passkey authentication error:', error);
      return { success: false, error: error?.message };
    }
  }

  detectDeviceType() {
    const ua = navigator.userAgent;
    if (/mobile/i?.test(ua)) return 'mobile';
    if (/tablet/i?.test(ua)) return 'tablet';
    return 'desktop';
  }

  // ============ MAGIC LINK AUTHENTICATION ============
  
  async sendMagicLink(email, redirectTo = window.location?.origin) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        }
      });

      if (error) throw error;

      // Log magic link request
      await supabase?.from('authentication_logs')?.insert({
        email,
        method: 'magic_link',
        status: 'sent',
        ip_address: await this.getClientIP(),
      });

      return { success: true, message: 'Magic link sent to your email' };
    } catch (error) {
      console.error('Magic link error:', error);
      return { success: false, error: error?.message };
    }
  }

  async verifyMagicLink(token, type) {
    try {
      const { data, error } = await supabase?.auth?.verifyOtp({
        token_hash: token,
        type: type || 'magiclink',
      });

      if (error) throw error;

      return { success: true, user: data?.user };
    } catch (error) {
      console.error('Magic link verification error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ OAUTH AUTHENTICATION ============
  
  async signInWithOAuth(provider) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider, // 'google', 'apple', 'facebook', 'twitter'
        options: {
          redirectTo: `${window.location?.origin}/auth/callback`,
          scopes: this.getProviderScopes(provider),
        }
      });

      if (error) throw error;

      return { success: true, url: data?.url };
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error);
      return { success: false, error: error?.message };
    }
  }

  async signInWithEnterpriseSSO({ domain, providerId }) {
    try {
      const { data, error } = await supabase?.auth?.signInWithSSO({
        ...(domain ? { domain } : {}),
        ...(providerId ? { providerId } : {}),
        options: {
          redirectTo: `${window.location?.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { success: true, url: data?.url };
    } catch (error) {
      console.error('Enterprise SSO error:', error);
      return { success: false, error: error?.message };
    }
  }

  getProviderScopes(provider) {
    const scopes = {
      google: 'email profile',
      facebook: 'email public_profile',
      twitter: 'users.read tweet.read',
      apple: 'email name',
    };
    return scopes?.[provider] || '';
  }

  // ============ ELECTION-SPECIFIC AUTHENTICATION ============
  
  async getElectionAuthMethods(electionId) {
    try {
      const { data, error } = await supabase?.from('elections')?.select('authentication_methods, require_biometric, require_otp')?.eq('id', electionId)?.single();

      if (error) throw error;

      return {
        success: true,
        methods: data?.authentication_methods || ['email_password'],
        requireBiometric: data?.require_biometric || false,
        requireOTP: data?.require_otp || false,
      };
    } catch (error) {
      console.error('Get election auth methods error:', error);
      return { success: false, error: error?.message };
    }
  }

  async updateElectionAuthMethods(electionId, methods) {
    try {
      const { data, error } = await supabase?.from('elections')?.update({
          authentication_methods: methods?.authMethods,
          require_biometric: methods?.requireBiometric,
          require_otp: methods?.requireOTP,
        })?.eq('id', electionId)?.select()?.single();

      if (error) throw error;

      return { success: true, election: data };
    } catch (error) {
      console.error('Update election auth methods error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ OTP AUTHENTICATION ============
  
  async sendOTP(phoneOrEmail, type = 'sms', options = {}) {
    try {
      if (type === 'sms' && !isSmsAllowedUseCase(options?.useCase || 'otp_fallback')) {
        return {
          success: false,
          error: 'SMS OTP is restricted to fallback/security/admin use-cases',
        };
      }
      const otpPayload = type === 'sms' 
        ? { phone: phoneOrEmail }
        : { email: phoneOrEmail };

      const { data, error } = await supabase?.auth?.signInWithOtp(otpPayload);

      if (error) throw error;

      return { success: true, message: `OTP sent via ${type}` };
    } catch (error) {
      console.error('OTP send error:', error);
      return { success: false, error: error?.message };
    }
  }

  async verifyOTP(phoneOrEmail, token, type = 'sms') {
    try {
      const options = type === 'sms'
        ? { phone: phoneOrEmail, token, type: 'sms' }
        : { email: phoneOrEmail, token, type: 'email' };

      const { data, error } = await supabase?.auth?.verifyOtp(options);

      if (error) throw error;

      return { success: true, user: data?.user };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ BIOMETRIC AUTHENTICATION ============
  
  async checkBiometricSupport() {
    if (!window.PublicKeyCredential) {
      return { supported: false, reason: 'WebAuthn not supported' };
    }

    const available = await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable();
    return { supported: available, reason: available ? 'Biometric available' : 'No biometric authenticator' };
  }

  // ============ UTILITY METHODS ============
  
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response?.json();
      return data?.ip;
    } catch {
      return 'unknown';
    }
  }

  async logAuthenticationAttempt(email, method, status, metadata = {}) {
    try {
      await supabase?.from('authentication_logs')?.insert({
        email,
        method,
        status,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        metadata,
      });
    } catch (error) {
      console.error('Log authentication attempt error:', error);
    }
  }
}

export default new AuthenticationService();