# Dual Ad System – Confirmation

## Summary

- **Internal (participatory / Facebook-like) ads** are **primary**.
- **External ad networks** are **fallback** and fill only when internal does not fill a slot (or when internal ads are switched off).

---

## Web App

| Layer | Implementation |
|-------|----------------|
| **Primary** | Internal participatory ads (Vottery Ads Studio + legacy `sponsored_elections`). Filled via `adSlotManagerService.allocateAdSlots()` → `tryAllocateInternalAd()`. |
| **Fallback** (when internal unfilled or disabled) | **Ezoic**, **PropellerAds**, **HilltopAds**, **AdSense**. Weights: Ezoic 27%, PropellerAds 27%, HilltopAds 28%, AdSense 18% (configurable via `VITE_EZOIC_SITE_ID`, `VITE_PROPELLERADS_ZONE_ID`, `VITE_HILLTOPADS_ZONE_ID`, `VITE_ADSENSE_CLIENT` / `VITE_ADSENSE_ID`). If only AdSense is configured, 100% AdSense. |
| **Switch off internal at launch** | Set `VITE_INTERNAL_ADS_ENABLED=false` (or `0`) in env so all slots use fallbacks only. Alternatively use feature toggle `internalAdsEnabled: false` in context passed to `allocateAdSlots()`. |

**Files:** `src/services/adSlotManagerService.js`, `src/components/AdSlotRenderer.jsx`, `src/pages/ad-slot-manager-inventory-control-center/`, `src/pages/dual-advertising-system-analytics-dashboard/`.

---

## Mobile App

| Layer | Implementation |
|-------|----------------|
| **Primary** | Internal ads (`vottery_ads`, `sponsored_elections`) via `AdSlotOrchestrationService.getAdForSlot()`. Respects `AdNetworkConfig.internalAdsEnabled` and Supabase `platform_feature_toggles.participatory_advertising`. |
| **Fallback** (when internal unfilled or disabled) | **AppLovin MAX** (70%) + **AdMob** (30%) when both configured; else AppLovin only or AdMob only. Placeholder AdSense unit used if neither SDK is configured. |
| **Switch off internal at launch** | (1) **Build-time:** `--dart-define=INTERNAL_ADS_ENABLED=false` so only fallbacks run. (2) **Runtime:** set `platform_feature_toggles.participatory_advertising = false` in Supabase so internal is disabled without a new build. |

**Files:** `lib/services/ad_slot_orchestration_service.dart`, `lib/constants/ad_network_config.dart`, `lib/presentation/social_media_home_feed/widgets/ad_slot_widget.dart`.

---

## Confirmation Checklist

- [x] Internal ads are primary on Web and Mobile.
- [x] Web fallbacks: Ezoic, PropellerAds, HilltopAds, AdSense (weighted).
- [x] Mobile fallbacks: AppLovin MAX, AdMob (and AdSense placeholder if no SDK).
- [x] Internal can be completely switched off at launch (env / feature toggle on Web; dart-define or Supabase on Mobile); only fallbacks then fill.
