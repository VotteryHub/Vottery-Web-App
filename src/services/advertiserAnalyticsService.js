/**
 * Advertiser analytics — Web API surface aligned with Mobile `AdvertiserAnalyticsService`
 * (`lib/services/advertiser_analytics_service.dart`).
 *
 * Implementation lives in `votteryAdsAnalyticsService.js` (vottery_* tables + ad_events).
 * Import `advertiserAnalyticsService` in UI for the same conceptual name as Flutter.
 */

export {
  votteryAdsAnalyticsService,
  votteryAdsAnalyticsService as advertiserAnalyticsService,
} from './votteryAdsAnalyticsService';
