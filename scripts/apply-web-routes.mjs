/**
 * Rewrites Routes.jsx `routes` array to use Web.* from navigationHubRoutes.js,
 * inserts consolidated admin/revenue routes, removes duplicate <Route> block.
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const hubPath = path.join(root, "src", "constants", "navigationHubRoutes.js");
const routesPath = path.join(root, "src", "Routes.jsx");

function parseHubExports(content) {
  /** @type {Map<string, string>} path -> export name */
  const map = new Map();
  let i = 0;
  while (i < content.length) {
    const idx = content.indexOf("export const ", i);
    if (idx === -1) break;
    const nameStart = idx + "export const ".length;
    const eq = content.indexOf("=", nameStart);
    if (eq === -1) break;
    const name = content.slice(nameStart, eq).trim();
    let j = eq + 1;
    while (j < content.length && /\s/.test(content[j])) j++;
    let routePath = "";
    if (content[j] === "'" || content[j] === '"') {
      const q = content[j];
      j++;
      while (j < content.length && content[j] !== q) routePath += content[j++];
      j++;
    } else {
      while (j < content.length && content[j] !== "'" && content[j] !== '"') j++;
      if (j >= content.length) break;
      const q = content[j];
      j++;
      while (j < content.length && content[j] !== q) routePath += content[j++];
      j++;
    }
    if (map.has(routePath)) {
      console.warn("Duplicate path in hub (last wins):", routePath, map.get(routePath), "->", name);
    }
    map.set(routePath, name);
    i = j;
  }
  return map;
}

function replacePathStrings(segment, pathToName) {
  const paths = [...pathToName.keys()].sort((a, b) => b.length - a.length);
  let out = segment;
  for (const p of paths) {
    const name = pathToName.get(p);
    const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`path:\\s*["']${esc}["']`, "g"), `path: Web.${name}`);
    out = out.replace(new RegExp(`to=["']${esc}["']`, "g"), `to={Web.${name}}`);
  }
  return out;
}

const hubSrc = fs.readFileSync(hubPath, "utf8");
const pathToName = parseHubExports(hubSrc);

let routesSrc = fs.readFileSync(routesPath, "utf8");

const routesStart = routesSrc.indexOf("const routes = [");
if (routesStart === -1) throw new Error("const routes = [ not found");

const routesEnd = routesSrc.indexOf("\n    ];", routesStart);
if (routesEnd === -1) throw new Error("routes array end not found");

const head = routesSrc.slice(0, routesStart + "const routes = [".length);
const tailFromBracket = routesSrc.slice(routesStart + "const routes = [".length);
const routesEndRel = tailFromBracket.indexOf("\n    ];");
let arrayBody = tailFromBracket.slice(0, routesEndRel);
const tail = tailFromBracket.slice(routesEndRel);

arrayBody = replacePathStrings(arrayBody, pathToName);

const unmapped = [...arrayBody.matchAll(/path:\s*["'](\/[^"']+)["']/g)]
  .map((m) => m[1])
  .filter((p) => !pathToName.has(p));
if (unmapped.length) {
  console.error("Unmapped paths in routes array:", [...new Set(unmapped)]);
  process.exit(1);
}

const navigateUnmapped = [...arrayBody.matchAll(/to=["'](\/[^"']+)["']/g)]
  .map((m) => m[1])
  .filter((p) => !pathToName.has(p));
if (navigateUnmapped.length) {
  console.error("Unmapped Navigate targets:", [...new Set(navigateUnmapped)]);
  process.exit(1);
}

const insertMarker =
  "{ path: Web.COUNTRY_BASED_PAYOUT_PROCESSING_ENGINE_ROUTE, element: <EnhancedAutomatedPayoutCalculationEngineWithCountryBasedProcessing /> },";

const revenueAdminBlock = `
        { path: Web.ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE, element: <EnhancedDynamicRevenueSharingConfigurationCenter /> },
        { path: Web.REVENUE_FRAUD_DETECTION_ANOMALY_PREVENTION_CENTER_ROUTE, element: <RevenueFraudDetectionAnomalyPreventionCenter /> },
        { path: Web.PREDICTIVE_ANOMALY_ALERTING_DEVIATION_MONITORING_HUB_ROUTE, element: <PredictiveAnomalyAlertingDeviationMonitoringHub /> },
        { path: Web.DUAL_ADVERTISING_SYSTEM_ANALYTICS_DASHBOARD_ROUTE, element: <DualAdvertisingSystemAnalyticsDashboard /> },
        { path: Web.AI_DEPENDENCY_RISK_MITIGATION_COMMAND_CENTER_ROUTE, element: <AIDependencyRiskMitigationCommandCenter /> },
        { path: Web.GEMINI_FALLBACK_ORCHESTRATION_HUB_ROUTE, element: <GeminiFallbackOrchestrationHub /> },
        { path: Web.COUNTRY_REVENUE_SHARE_MANAGEMENT_CENTER_ROUTE, element: <CountryRevenueShareManagementCenter /> },
        { path: Web.ENHANCED_AUTOMATED_PAYOUT_CALCULATION_ENGINE_WITH_COUNTRY_BASED_PROCESSING_ROUTE, element: <EnhancedAutomatedPayoutCalculationEngineWithCountryBasedProcessing /> },
        { path: Web.CREATOR_COUNTRY_VERIFICATION_INTERFACE_ROUTE, element: <CreatorCountryVerificationInterface /> },
        { path: Web.REGIONAL_REVENUE_ANALYTICS_DASHBOARD_ROUTE, element: <RegionalRevenueAnalyticsDashboard /> },
        { path: Web.LOCALIZATION_TAX_REPORTING_INTELLIGENCE_CENTER_ROUTE, element: <LocalizationTaxReportingIntelligenceCenter /> },
        { path: Web.CLAUDE_CREATOR_SUCCESS_AGENT_ROUTE, element: <ClaudeCreatorSuccessAgent /> },
        { path: Web.OPEN_AI_SMS_OPTIMIZATION_STUDIO_ROUTE, element: <OpenAISMSOptimizationStudio /> },
        { path: Web.STRIPE_CONNECT_ACCOUNT_LINKING_INTERFACE_ROUTE, element: <StripeConnectAccountLinkingInterface /> },
`;

if (!arrayBody.includes(insertMarker)) {
  throw new Error("insertMarker not found in routes array");
}
if (!arrayBody.includes("ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE")) {
  arrayBody = arrayBody.replace(insertMarker, insertMarker + revenueAdminBlock);
}

function removeDuplicateRoutesAfterMap(src) {
  const mapEnd = src.indexOf("))}");
  if (mapEnd === -1) throw new Error("routes map closing not found");
  const afterMap = src.slice(mapEnd + 3);
  const dupIdx = afterMap.search(/<Route\s+[\s\S]*?path=\{?["']?\/enhanced-dynamic-revenue-sharing-configuration-center/);
  if (dupIdx === -1) {
    // already removed
    return src;
  }
  const absoluteDup = mapEnd + 3 + dupIdx;
  const routerClose = src.indexOf("</RouterRoutes>", absoluteDup);
  if (routerClose === -1) throw new Error("</RouterRoutes> not found after duplicate block");
  const before = src.slice(0, absoluteDup).replace(/\s+$/, "\n");
  const after = src.slice(routerClose);
  return before + "                    " + after;
}

let out = head + arrayBody + tail;
out = removeDuplicateRoutesAfterMap(out);

fs.writeFileSync(routesPath + ".bak", routesSrc);
fs.writeFileSync(routesPath, out);
console.log("Updated Routes.jsx (backup: Routes.jsx.bak)");
