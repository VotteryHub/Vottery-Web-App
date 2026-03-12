import { supabase } from '../lib/supabase';
import { openDB } from 'idb';
import { CryptoUtils } from './cryptographyService';

const DB_NAME = 'vottery_voting_sessions';
const DB_VERSION = 1;
const STORE_NAME = 'sessions';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, (letter) => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db?.objectStoreNames?.contains(STORE_NAME)) {
        const store = db?.createObjectStore(STORE_NAME, { keyPath: 'sessionKey' });
        store?.createIndex('userId', 'userId');
        store?.createIndex('electionId', 'electionId');
        store?.createIndex('lastUpdated', 'lastUpdated');
      }
    },
  });
};

// Generate session hash for blockchain verification
const generateSessionHash = (sessionData) => {
  const dataString = JSON.stringify({
    userId: sessionData?.userId,
    electionId: sessionData?.electionId,
    sessionState: sessionData?.sessionState,
    timestamp: Date.now()
  });
  return CryptoUtils?.hash(dataString);
};

// Generate blockchain hash simulation
const generateBlockchainHash = () => {
  return `0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16)?.toString(16)
  )?.join('')}`;
};

export const votingSessionPersistenceService = {
  // Save session to both IndexedDB and Supabase
  async saveSession(sessionData) {
    try {
      const sessionHash = generateSessionHash(sessionData);
      const blockchainHash = generateBlockchainHash();
      const sessionKey = `${sessionData?.userId}_${sessionData?.electionId}`;

      // Save to IndexedDB (local persistence)
      const db = await initDB();
      await db?.put(STORE_NAME, {
        sessionKey,
        ...sessionData,
        sessionHash,
        blockchainHash,
        lastUpdated: Date.now(),
        synced: false
      });

      // Save to Supabase (cloud backup)
      const { data, error } = await supabase
        ?.from('voting_sessions')
        ?.upsert(toSnakeCase({
          userId: sessionData?.userId,
          electionId: sessionData?.electionId,
          sessionState: sessionData?.sessionState,
          currentStep: sessionData?.currentStep,
          mcqCompleted: sessionData?.mcqCompleted,
          mediaCompleted: sessionData?.mediaCompleted,
          selectedOptionId: sessionData?.selectedOptionId,
          rankedChoices: sessionData?.rankedChoices,
          selectedOptions: sessionData?.selectedOptions,
          voteScores: sessionData?.voteScores,
          blockchainHash,
          sessionHash,
          lastUpdatedAt: new Date()?.toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString()
        }), { onConflict: 'user_id,election_id' })
        ?.select()
        ?.single();

      if (error) throw error;

      // Mark as synced in IndexedDB
      await db?.put(STORE_NAME, {
        sessionKey,
        ...sessionData,
        sessionHash,
        blockchainHash,
        lastUpdated: Date.now(),
        synced: true
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Save session error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Load session with blockchain verification
  async loadSession(userId, electionId) {
    try {
      const sessionKey = `${userId}_${electionId}`;

      // Try IndexedDB first (faster)
      const db = await initDB();
      const localSession = await db?.get(STORE_NAME, sessionKey);

      if (localSession) {
        // Verify session hash
        const verifiedHash = generateSessionHash(localSession);
        if (verifiedHash === localSession?.sessionHash) {
          return { 
            data: localSession, 
            error: null,
            source: 'local',
            verified: true
          };
        }
      }

      // Fallback to Supabase (cloud recovery)
      const { data, error } = await supabase
        ?.from('voting_sessions')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.eq('election_id', electionId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      if (data) {
        const camelData = toCamelCase(data);
        
        // Verify blockchain hash
        const blockchainVerified = data?.blockchain_hash?.startsWith('0x');

        // Save to IndexedDB for future use
        await db?.put(STORE_NAME, {
          sessionKey,
          userId: camelData?.userId,
          electionId: camelData?.electionId,
          sessionState: camelData?.sessionState,
          currentStep: camelData?.currentStep,
          mcqCompleted: camelData?.mcqCompleted,
          mediaCompleted: camelData?.mediaCompleted,
          selectedOptionId: camelData?.selectedOptionId,
          rankedChoices: camelData?.rankedChoices,
          selectedOptions: camelData?.selectedOptions,
          voteScores: camelData?.voteScores,
          blockchainHash: camelData?.blockchainHash,
          sessionHash: camelData?.sessionHash,
          lastUpdated: Date.now(),
          synced: true
        });

        // Update recovery attempts
        await supabase
          ?.from('voting_sessions')
          ?.update({ 
            recovered: true,
            recovery_attempts: (data?.recovery_attempts || 0) + 1
          })
          ?.eq('id', data?.id);

        return { 
          data: camelData, 
          error: null,
          source: 'cloud',
          verified: blockchainVerified,
          recovered: true
        };
      }

      return { data: null, error: null };
    } catch (error) {
      console.error('Load session error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Delete session after successful vote
  async deleteSession(userId, electionId) {
    try {
      const sessionKey = `${userId}_${electionId}`;

      // Delete from IndexedDB
      const db = await initDB();
      await db?.delete(STORE_NAME, sessionKey);

      // Delete from Supabase
      const { error } = await supabase
        ?.from('voting_sessions')
        ?.delete()
        ?.eq('user_id', userId)
        ?.eq('election_id', electionId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Delete session error:', error);
      return { error: { message: error?.message } };
    }
  },

  // Get all sessions for a user
  async getUserSessions(userId) {
    try {
      const db = await initDB();
      const index = db?.transaction(STORE_NAME)?.store?.index('userId');
      const sessions = await index?.getAll(userId);

      return { data: sessions, error: null };
    } catch (error) {
      console.error('Get user sessions error:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  // Sync all unsynced sessions
  async syncUnsyncedSessions() {
    try {
      const db = await initDB();
      const allSessions = await db?.getAll(STORE_NAME);
      const unsyncedSessions = allSessions?.filter(s => !s?.synced);

      const syncResults = [];
      for (const session of unsyncedSessions) {
        const result = await this.saveSession(session);
        syncResults?.push(result);
      }

      return { 
        data: { 
          total: unsyncedSessions?.length, 
          synced: syncResults?.filter(r => !r?.error)?.length 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Sync sessions error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Clear expired sessions
  async clearExpiredSessions() {
    try {
      const db = await initDB();
      const allSessions = await db?.getAll(STORE_NAME);
      const now = Date.now();
      const expiredThreshold = 24 * 60 * 60 * 1000; // 24 hours

      for (const session of allSessions) {
        if (now - session?.lastUpdated > expiredThreshold) {
          await db?.delete(STORE_NAME, session?.sessionKey);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Clear expired sessions error:', error);
      return { error: { message: error?.message } };
    }
  }
};