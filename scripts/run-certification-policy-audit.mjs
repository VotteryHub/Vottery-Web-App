import fs from 'node:fs';
import path from 'node:path';

const checks = [
  {
    id: 'web_full_feature_route_mode',
    file: 'src/config/batch1RouteAllowlist.js',
    mustContain: ['VITE_FULL_FEATURE_CERTIFICATION', 'if (FULL_FEATURE_CERTIFICATION_MODE) return true;'],
  },
  {
    id: 'mobile_full_feature_route_mode',
    file: '../Vottery-Mobile-App/lib/config/batch1_route_allowlist.dart',
    mustContain: ['FULL_FEATURE_CERTIFICATION', 'if (_fullFeatureCertificationMode) return true;'],
  },
  {
    id: 'web_policy_force_disabled_preserved',
    file: 'src/services/platformFeatureToggleService.js',
    mustContain: ['BATCH1_FORCE_DISABLED_FEATURE_KEYS.has(key)', 'if (FULL_FEATURE_CERTIFICATION_MODE && !enabled.has(key)) return true;'],
  },
  {
    id: 'mobile_policy_force_disabled_preserved',
    file: '../Vottery-Mobile-App/lib/services/platform_feature_toggle_service.dart',
    mustContain: ['Batch1ControlPolicy.forceDisabledFeatureKeys.contains(key)', 'if (_fullFeatureCertificationMode && !enabled.contains(key)) return true;'],
  },
  {
    id: 'web_internal_ads_killswitch',
    file: 'src/constants/votteryAdsConstants.js',
    mustContain: ['INTERNAL_ADS_BATCH1_DISABLED = true'],
  },
  {
    id: 'mobile_internal_ads_killswitch',
    file: '../Vottery-Mobile-App/lib/constants/vottery_ads_constants.dart',
    mustContain: ['internalAdsBatch1Disabled = true'],
  },
];

let failures = 0;
for (const check of checks) {
  const full = path.resolve(process.cwd(), check.file);
  let text = '';
  try {
    text = fs.readFileSync(full, 'utf8');
  } catch (e) {
    console.log(`FAIL ${check.id}: missing file ${check.file}`);
    failures += 1;
    continue;
  }
  const missing = check.mustContain.filter((s) => !text.includes(s));
  if (missing.length) {
    console.log(`FAIL ${check.id}: missing snippets -> ${missing.join(' | ')}`);
    failures += 1;
  } else {
    console.log(`PASS ${check.id}`);
  }
}

if (failures > 0) {
  console.log(`Certification policy audit failed: ${failures} check(s)`);
  process.exit(1);
}

console.log('Certification policy audit passed');
