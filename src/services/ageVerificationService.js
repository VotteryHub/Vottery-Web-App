import { supabase } from '../lib/supabase';
import * as faceapi from 'face-api.js';
import CryptoJS from 'crypto-js';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_(\w)/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const ageVerificationService = {
  async initializeFaceAPI() {
    try {
      const MODEL_URL = '/models';
      await faceapi?.nets?.tinyFaceDetector?.loadFromUri(MODEL_URL);
      await faceapi?.nets?.ageGenderNet?.loadFromUri(MODEL_URL);
      await faceapi?.nets?.faceLandmark68Net?.loadFromUri(MODEL_URL);
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async performFacialAgeEstimation(imageData) {
    try {
      const img = await faceapi?.bufferToImage(imageData);
      const detections = await faceapi
        ?.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        ?.withFaceLandmarks()
        ?.withAgeAndGender();

      if (!detections) {
        return { success: false, error: 'No face detected' };
      }

      const estimatedAge = Math.round(detections?.age);
      const confidence = detections?.detection?.score * 100;
      const ageRangeMin = Math.max(0, estimatedAge - 3);
      const ageRangeMax = estimatedAge + 3;

      return {
        success: true,
        estimatedAge,
        ageRangeMin,
        ageRangeMax,
        confidence,
        gender: detections?.gender,
        genderProbability: detections?.genderProbability
      };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async verifyAge(userId, electionId, verificationData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user || user?.id !== userId) throw new Error('Unauthorized');

      const { data: election } = await supabase
        ?.from('elections')
        ?.select('min_age_requirement, waterfall_verification, age_verification_methods')
        ?.eq('id', electionId)
        ?.single();

      if (!election) throw new Error('Election not found');

      const minAge = election?.min_age_requirement || 18;
      let verificationStatus = 'pending';
      let fallbackTriggered = false;

      // Waterfall approach
      if (verificationData?.method === 'ai_facial') {
        const ageResult = await this.performFacialAgeEstimation(verificationData?.imageData);
        
        if (!ageResult?.success) {
          return { success: false, error: ageResult?.error };
        }

        // Check if borderline (within 3-year buffer)
        const isBorderline = ageResult?.ageRangeMax >= minAge && ageResult?.ageRangeMin < minAge;
        
        if (isBorderline && election?.waterfall_verification) {
          fallbackTriggered = true;
          verificationStatus = 'borderline';
        } else if (ageResult?.estimatedAge >= minAge) {
          verificationStatus = 'verified';
        } else {
          verificationStatus = 'failed';
        }

        const recordData = toSnakeCase({
          userId,
          electionId,
          verificationMethod: 'ai_facial',
          verificationStatus,
          confidenceScore: ageResult?.confidence,
          estimatedAge: ageResult?.estimatedAge,
          ageRangeMin: ageResult?.ageRangeMin,
          ageRangeMax: ageResult?.ageRangeMax,
          fallbackTriggered,
          verificationMetadata: {
            gender: ageResult?.gender,
            genderProbability: ageResult?.genderProbability
          }
        });

        const { data, error } = await supabase
          ?.from('age_verification_records')
          ?.insert(recordData)
          ?.select()
          ?.single();

        if (error) throw error;

        await this.logAuditTrail(data?.id, userId, 'facial_age_estimation_completed');

        return {
          success: true,
          data: toCamelCase(data),
          requiresFallback: fallbackTriggered
        };
      }

      if (verificationData?.method === 'government_id') {
        const idResult = await this.verifyGovernmentID(verificationData);
        
        const recordData = toSnakeCase({
          userId,
          electionId,
          verificationMethod: 'government_id',
          verificationStatus: idResult?.verified ? 'verified' : 'failed',
          documentType: verificationData?.documentType,
          documentAuthenticityScore: idResult?.authenticityScore,
          livenessCheckPassed: idResult?.livenessCheck,
          verificationMetadata: idResult?.metadata
        });

        const { data, error } = await supabase
          ?.from('age_verification_records')
          ?.insert(recordData)
          ?.select()
          ?.single();

        if (error) throw error;

        await this.logAuditTrail(data?.id, userId, 'government_id_verification_completed');

        return { success: true, data: toCamelCase(data) };
      }

      if (verificationData?.method === 'digital_wallet') {
        const walletResult = await this.verifyDigitalWallet(userId, verificationData);
        
        const recordData = toSnakeCase({
          userId,
          electionId,
          verificationMethod: 'digital_wallet',
          verificationStatus: walletResult?.verified ? 'verified' : 'failed',
          verificationMetadata: walletResult?.metadata
        });

        const { data, error } = await supabase
          ?.from('age_verification_records')
          ?.insert(recordData)
          ?.select()
          ?.single();

        if (error) throw error;

        return { success: true, data: toCamelCase(data) };
      }

      throw new Error('Invalid verification method');
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async verifyGovernmentID(verificationData) {
    // Simulated government ID verification
    // In production, integrate with Onfido, Jumio, or similar service
    return {
      verified: true,
      authenticityScore: 95.5,
      livenessCheck: true,
      metadata: {
        documentType: verificationData?.documentType,
        issueCountry: verificationData?.issueCountry,
        expiryDate: verificationData?.expiryDate
      }
    };
  },

  async verifyDigitalWallet(userId, verificationData) {
    try {
      const { data: wallet } = await supabase
        ?.from('digital_identity_wallets')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();

      if (!wallet) {
        return { verified: false, error: 'No digital wallet found' };
      }

      // Verify wallet token
      const tokenValid = await this.verifyWalletToken(wallet?.wallet_token, verificationData?.token);
      
      return {
        verified: tokenValid && wallet?.age_verified,
        metadata: {
          provider: wallet?.wallet_provider,
          verifiedAgeRange: wallet?.verified_age_range,
          verificationDate: wallet?.verification_date
        }
      };
    } catch (error) {
      return { verified: false, error: error?.message };
    }
  },

  async verifyWalletToken(storedToken, providedToken) {
    return storedToken === providedToken;
  },

  async createDigitalWallet(userId, walletData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user || user?.id !== userId) throw new Error('Unauthorized');

      const encryptedCredentials = CryptoJS?.AES?.encrypt(
        JSON.stringify(walletData?.credentials),
        import.meta.env?.VITE_ENCRYPTION_KEY || 'default-key'
      )?.toString();

      const dbData = toSnakeCase({
        userId,
        walletProvider: walletData?.provider,
        walletToken: walletData?.token,
        encryptedCredentials,
        ageVerified: walletData?.ageVerified,
        verifiedAgeRange: walletData?.ageRange,
        verificationDate: new Date()?.toISOString(),
        expiryDate: walletData?.expiryDate,
        privacyLevel: walletData?.privacyLevel || 'minimal',
        selectiveDisclosureEnabled: true
      });

      const { data, error } = await supabase
        ?.from('digital_identity_wallets')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;

      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async getVerificationStatus(userId, electionId) {
    try {
      const { data, error } = await supabase
        ?.from('age_verification_records')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: false })
        ?.limit(1)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      return { success: true, data: data ? toCamelCase(data) : null };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async logAuditTrail(verificationId, userId, action) {
    try {
      await supabase?.from('age_verification_audit_logs')?.insert({
        verification_id: verificationId,
        user_id: userId,
        action,
        ip_address: '0.0.0.0',
        user_agent: navigator?.userAgent,
        metadata: {}
      });
    } catch (error) {
      console.error('Audit log error:', error);
    }
  },

  async deleteTemporaryData() {
    try {
      const { error } = await supabase?.rpc('auto_delete_verification_data');
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }
};

export default ageVerificationService;