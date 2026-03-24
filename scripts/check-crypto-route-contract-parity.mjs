import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertContains(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

const webRouteFeatureKeys = read(
  path.resolve(webRoot, 'src', 'config', 'routeFeatureKeys.js')
);
const mobileRouteFeatureKeys = read(
  path.resolve(mobileRoot, 'lib', 'config', 'route_feature_keys.dart')
);
const mobileRoutes = read(
  path.resolve(mobileRoot, 'lib', 'routes', 'app_routes.dart')
);
const mobileRegistry = read(
  path.resolve(mobileRoot, 'lib', 'config', 'route_registry.dart')
);
const mobileAppUrls = read(
  path.resolve(mobileRoot, 'lib', 'constants', 'app_urls.dart')
);

// Web source-of-truth keys for crypto/security surfaces.
assertContains(
  webRouteFeatureKeys,
  "'cryptographic-security-management-center': 'security_compliance_audit_screen'",
  'web crypto security feature key'
);
assertContains(
  webRouteFeatureKeys,
  "'vote-anonymity-mixnet-control-hub': 'security_compliance_audit_screen'",
  'web mixnet feature key'
);
assertContains(
  webRouteFeatureKeys,
  "'public-bulletin-board-audit-trail-center': 'public_bulletin_board_audit_trail_center'",
  'web bulletin feature key'
);

// Mobile route constants.
assertContains(
  mobileRoutes,
  "static const String cryptographicSecurityManagementCenter =",
  'mobile cryptographic route constant'
);
assertContains(
  mobileRoutes,
  "static const String voteAnonymityMixnetControlHub =",
  'mobile mixnet route constant'
);
assertContains(
  mobileRoutes,
  "static const String publicBulletinBoardAuditTrailCenter =",
  'mobile bulletin route constant'
);

// Mobile route registry mappings.
assertContains(
  mobileRegistry,
  'case AppRoutes.cryptographicSecurityManagementCenter:',
  'mobile registry cryptographic route'
);
assertContains(
  mobileRegistry,
  'case AppRoutes.voteAnonymityMixnetControlHub:',
  'mobile registry mixnet route'
);
assertContains(
  mobileRegistry,
  'case AppRoutes.publicBulletinBoardAuditTrailCenter:',
  'mobile registry bulletin route'
);

// Mobile feature key parity.
assertContains(
  mobileRouteFeatureKeys,
  "'cryptographic-security-management-center':\n        'security_compliance_audit_screen'",
  'mobile crypto feature key'
);
assertContains(
  mobileRouteFeatureKeys,
  "'vote-anonymity-mixnet-control-hub': 'security_compliance_audit_screen'",
  'mobile mixnet feature key'
);
assertContains(
  mobileRouteFeatureKeys,
  "'public-bulletin-board-audit-trail-center':\n        'public_bulletin_board_audit_trail_center'",
  'mobile bulletin feature key'
);

// Mobile URL launcher constants.
assertContains(
  mobileAppUrls,
  "static const String cryptographicSecurityManagementCenter =",
  'mobile app URL cryptographic constant'
);
assertContains(
  mobileAppUrls,
  "static const String voteAnonymityMixnetControlHub =",
  'mobile app URL mixnet constant'
);
assertContains(
  mobileAppUrls,
  "static const String publicBulletinBoardAuditTrailCenter =",
  'mobile app URL bulletin constant'
);

console.log('Crypto route contract parity checks passed (Web <-> Mobile).');
