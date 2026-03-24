import fs from "fs";
import path from "path";

const hubPath = path.join(process.cwd(), "src", "constants", "navigationHubRoutes.js");
const fragPath = path.join(process.cwd(), "scripts", "new-route-exports.fragment.js");

let frag = fs.readFileSync(fragPath, "utf8").replace(/"/g, "'");

const adminOnly = `
// Admin/revenue routes previously registered only in a duplicate Routes.jsx block (now consolidated).
export const ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE =
  '/enhanced-dynamic-revenue-sharing-configuration-center';
export const REVENUE_FRAUD_DETECTION_ANOMALY_PREVENTION_CENTER_ROUTE =
  '/revenue-fraud-detection-anomaly-prevention-center';
export const PREDICTIVE_ANOMALY_ALERTING_DEVIATION_MONITORING_HUB_ROUTE =
  '/predictive-anomaly-alerting-deviation-monitoring-hub';
export const DUAL_ADVERTISING_SYSTEM_ANALYTICS_DASHBOARD_ROUTE =
  '/dual-advertising-system-analytics-dashboard';
export const AI_DEPENDENCY_RISK_MITIGATION_COMMAND_CENTER_ROUTE =
  '/ai-dependency-risk-mitigation-command-center';
export const GEMINI_FALLBACK_ORCHESTRATION_HUB_ROUTE = '/gemini-fallback-orchestration-hub';
export const COUNTRY_REVENUE_SHARE_MANAGEMENT_CENTER_ROUTE =
  '/country-revenue-share-management-center';
export const ENHANCED_AUTOMATED_PAYOUT_CALCULATION_ENGINE_WITH_COUNTRY_BASED_PROCESSING_ROUTE =
  '/enhanced-automated-payout-calculation-engine-with-country-based-processing';
export const CREATOR_COUNTRY_VERIFICATION_INTERFACE_ROUTE =
  '/creator-country-verification-interface';
export const REGIONAL_REVENUE_ANALYTICS_DASHBOARD_ROUTE =
  '/regional-revenue-analytics-dashboard';
export const LOCALIZATION_TAX_REPORTING_INTELLIGENCE_CENTER_ROUTE =
  '/localization-tax-reporting-intelligence-center';
export const CLAUDE_CREATOR_SUCCESS_AGENT_ROUTE = '/claude-creator-success-agent';
export const OPEN_AI_SMS_OPTIMIZATION_STUDIO_ROUTE = '/open-ai-sms-optimization-studio';
export const STRIPE_CONNECT_ACCOUNT_LINKING_INTERFACE_ROUTE =
  '/stripe-connect-account-linking-interface';
`.trimStart();

const hub = fs.readFileSync(hubPath, "utf8").trimEnd();
fs.writeFileSync(
  hubPath,
  `${hub}

// Routes.jsx extended table (see scripts/gen-route-constants.mjs)
${frag}
${adminOnly}
`
);

console.log("Appended to navigationHubRoutes.js");
