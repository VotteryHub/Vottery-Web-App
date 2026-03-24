import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');

const read = (p) => fs.readFileSync(p, 'utf8');
const assertContains = (haystack, needle, label) => {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
};

const navigationHubRoutes = read(
  path.resolve(webRoot, 'src', 'constants', 'navigationHubRoutes.js')
);
const routeFeatureKeys = read(
  path.resolve(webRoot, 'src', 'config', 'routeFeatureKeys.js')
);
const appRoutes = read(path.resolve(mobileRoot, 'lib', 'routes', 'app_routes.dart'));
const routeRegistry = read(
  path.resolve(mobileRoot, 'lib', 'config', 'route_registry.dart')
);
const appUrls = read(path.resolve(mobileRoot, 'lib', 'constants', 'app_urls.dart'));
const evidenceScript = read(
  path.resolve(webRoot, 'scripts', 'apply-regression-evidence.mjs')
);

assertContains(
  navigationHubRoutes,
  "export const VOTE_IN_ELECTIONS_HUB_ROUTE = '/vote-in-elections-hub';",
  'web vote in elections route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ELECTIONS_DASHBOARD_ROUTE = '/elections-dashboard';",
  'web elections dashboard route constant'
);
assertContains(
  navigationHubRoutes,
  "export const SECURE_VOTING_INTERFACE_ROUTE = '/secure-voting-interface';",
  'web secure voting route constant'
);
assertContains(
  navigationHubRoutes,
  "export const VOTING_CATEGORIES_ROUTE = '/voting-categories';",
  'web voting categories route constant'
);
assertContains(
  navigationHubRoutes,
  "export const VOTE_VERIFICATION_PORTAL_ROUTE = '/vote-verification-portal';",
  'web vote verification route constant'
);
assertContains(
  navigationHubRoutes,
  "export const BLOCKCHAIN_AUDIT_PORTAL_ROUTE = '/blockchain-audit-portal';",
  'web blockchain audit route constant'
);

assertContains(
  routeFeatureKeys,
  "'vote-in-elections-hub': 'vote_in_elections_hub'",
  'web vote in elections feature key'
);
assertContains(
  routeFeatureKeys,
  "'secure-voting-interface': 'secure_voting_interface'",
  'web secure voting feature key'
);
assertContains(
  routeFeatureKeys,
  "'vote-verification-portal': 'vote_verification_portal'",
  'web vote verification feature key'
);
assertContains(
  routeFeatureKeys,
  "'blockchain-audit-portal': 'blockchain_verification'",
  'web blockchain audit feature key'
);

assertContains(
  appRoutes,
  'static const String voteInElectionsHubWebCanonical =',
  'mobile vote in elections canonical route'
);
assertContains(
  appRoutes,
  'static const String electionsDashboardWebCanonical =',
  'mobile elections dashboard canonical route'
);
assertContains(
  appRoutes,
  'static const String secureVotingInterfaceWebCanonical =',
  'mobile secure voting canonical route'
);
assertContains(
  appRoutes,
  'static const String votingCategoriesWebCanonical =',
  'mobile voting categories canonical route'
);
assertContains(
  appRoutes,
  'static const String voteVerificationPortalWebCanonical =',
  'mobile vote verification canonical route'
);
assertContains(
  appRoutes,
  "static const String blockchainAuditPortal = '/blockchain-audit-portal';",
  'mobile blockchain audit route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.voteInElectionsHubWebCanonical:',
  'mobile registry vote in elections mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.electionsDashboardWebCanonical:',
  'mobile registry elections dashboard mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.secureVotingInterfaceWebCanonical:',
  'mobile registry secure voting mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.votingCategoriesWebCanonical:',
  'mobile registry voting categories mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.voteVerificationPortalWebCanonical:',
  'mobile registry vote verification mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.blockchainAuditPortal:',
  'mobile registry blockchain audit mapping'
);

assertContains(
  appUrls,
  'static const String voteInElectionsHub =',
  'mobile URL vote in elections constant'
);
assertContains(
  appUrls,
  'static const String electionsDashboard =',
  'mobile URL elections dashboard constant'
);
assertContains(
  appUrls,
  'static const String secureVotingInterface =',
  'mobile URL secure voting constant'
);
assertContains(
  appUrls,
  'static const String votingCategories =',
  'mobile URL voting categories constant'
);
assertContains(
  appUrls,
  'static const String voteVerificationPortal =',
  'mobile URL vote verification constant'
);
assertContains(
  appUrls,
  'static const String blockchainAuditPortal =',
  'mobile URL blockchain audit constant'
);

assertContains(
  evidenceScript,
  'const voteCastingFlowIds = new Set([1, 11, 16, 18, 60, 96]);',
  'vote casting mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-vote-casting-contract-parity.mjs'",
  'vote casting node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/vote_casting_contract_test.dart'",
  'vote casting flutter evidence token'
);

console.log('Vote casting contract parity checks passed (Web <-> Mobile).');
