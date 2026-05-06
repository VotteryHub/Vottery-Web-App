import { expect, test, vi, beforeEach } from 'vitest';
import { adSlotManagerService } from '../../src/services/adSlotManagerService';

// Mock Supabase
vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { value_json: 'true' }, error: null })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        gte: vi.fn(() => ({
          lte: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      insert: vi.fn(() => Promise.resolve({ error: null }))
    }))
  }
}));

// Mock Env
vi.mock('import.meta.env', () => ({
  VITE_INTERNAL_ADS_ENABLED: 'true',
  VITE_ADSENSE_CLIENT: 'ca-pub-123',
  VITE_EZOIC_SITE_ID: '456'
}));

test('isPlacementAllowed should enforce strict placements', () => {
  expect(adSlotManagerService.isPlacementAllowed('FEED_VERTICAL')).toBe(true);
  expect(adSlotManagerService.isPlacementAllowed('JOLTS_INTERSTITIAL')).toBe(true);
  expect(adSlotManagerService.isPlacementAllowed('UNAUTHORIZED_SLOT')).toBe(false);
});

test('selectWebNetworkForSlot should respect V1 routing split', async () => {
  // Mock isNetworkReady to return true for all
  vi.spyOn(adSlotManagerService, 'isNetworkReady').mockResolvedValue(true);
  
  const results = { ezoic: 0, propellerads: 0, hilltopads: 0, google_adsense: 0 };
  
  // Run 1000 trials to check distribution
  for (let i = 0; i < 1000; i++) {
    const { adSystem } = await adSlotManagerService.selectWebNetworkForSlot({ 
      slot: { position: 'FEED_VERTICAL' }, 
      userProfile: { country_code: 'US' } 
    });
    results[adSystem]++;
  }
  
  // Check approximate distribution (27%, 27%, 28%, 18%)
  // We allow a wide margin for randomness in a small sample of 1000
  expect(results.ezoic).toBeGreaterThan(200);
  expect(results.propellerads).toBeGreaterThan(200);
  expect(results.hilltopads).toBeGreaterThan(200);
  expect(results.google_adsense).toBeGreaterThan(100);
});

test('Fallback to House Ad when no networks ready', async () => {
  vi.spyOn(adSlotManagerService, 'isNetworkReady').mockResolvedValue(false);
  
  const { adSystem } = await adSlotManagerService.selectWebNetworkForSlot({ 
    slot: { position: 'FEED_VERTICAL' }, 
    userProfile: { country_code: 'US' } 
  });
  
  expect(adSystem).toBe('internal_house_ad');
});
