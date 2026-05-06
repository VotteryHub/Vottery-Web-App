import { env } from '../config/env.config';
import useFeatureStore from '../store/useFeatureStore';

/**
 * Integration Health Service
 * Monitors the status of external integrations (Gemini, Claude, Shaped, etc.)
 * by checking if the feature is enabled AND required keys are present.
 */

class IntegrationHealthService {
  constructor() {
    this.integrations = {
      AI_GEMINI: {
        keys: ['VITE_GEMINI_API_KEY'],
        featureFlag: 'platform-feed-ranking-gemini'
      },
      AI_CLAUDE: {
        keys: ['VITE_CLAUDE_API_KEY'],
        featureFlag: 'platform-feed-ranking-claude'
      },
      AI_PERPLEXITY: {
        keys: ['VITE_PERPLEXITY_API_KEY'],
        featureFlag: 'platform-predictive-threat'
      },
      AI_SHAPED: {
        keys: ['VITE_SHAPED_API_KEY'],
        featureFlag: 'platform-recommendation-shaped'
      },
      STRIPE: {
        keys: ['VITE_STRIPE_PUBLISHABLE_KEY'],
        featureFlag: 'platform-stripe-subscriptions'
      }
    };
  }

  /**
   * Check health of all integrations
   */
  getHealthStatus() {
    const status = {};
    const featureStore = useFeatureStore.getState();

    Object.entries(this.integrations).forEach(([name, config]) => {
      const keysPresent = config.keys.every(key => !!env[key]);
      const flagEnabled = featureStore.isFeatureEnabled(config.featureFlag);

      status[name] = {
        isOperational: keysPresent && flagEnabled,
        isMissingKeys: !keysPresent,
        isFlagDisabled: !flagEnabled,
        missingKeys: config.keys.filter(key => !env[key])
      };

      // Log warning if flag is ON but keys are MISSING
      if (flagEnabled && !keysPresent) {
        console.warn(`⚠️ [IntegrationHealth] Feature "${config.featureFlag}" is ENABLED but required keys [${status[name].missingKeys.join(', ')}] are MISSING. Functionality will be safely disabled.`);
      }
    });

    return status;
  }

  /**
   * Check if a specific integration is fully operational
   */
  isOperational(integrationName) {
    const health = this.getHealthStatus();
    return health[integrationName]?.isOperational || false;
  }

  /**
   * Returns the healthiest AI provider based on current status.
   * Falls back to Claude if Gemini is down, and vice versa.
   */
  getHealthyAIProvider(preferred = 'GEMINI') {
    const health = this.getHealthStatus();
    const primary = `AI_${preferred?.toUpperCase()}`;
    const secondary = preferred?.toUpperCase() === 'GEMINI' ? 'AI_CLAUDE' : 'AI_GEMINI';

    if (health[primary]?.isOperational) return preferred?.toLowerCase();
    if (health[secondary]?.isOperational) {
      console.info(`🔄 [IntegrationHealth] Preferred AI provider ${preferred} is unavailable. Falling back to ${secondary?.split('_')?.[1]}.`);
      return secondary?.split('_')?.[1]?.toLowerCase();
    }

    return null;
  }
}

export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  CLAUDE: 'claude',
  PERPLEXITY: 'perplexity',
  SHAPED: 'shaped'
};

export const integrationHealthService = new IntegrationHealthService();
