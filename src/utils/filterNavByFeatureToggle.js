import { getFeatureKeyForPath } from '../config/routeFeatureKeys';
import { isBatch1RouteAllowed } from '../config/batch1RouteAllowlist';

/**
 * Filter nav items (menus, quick links, etc.) so disabled features are not shown.
 * Items with a path that maps to a feature_key are only included if isFeatureEnabled(key) is true.
 * Items whose path is not in the route-feature map are always included.
 * @param {Array<{ path: string, [key]: any }>} items - List of items with at least a path
 * @param {(key: string) => boolean} isFeatureEnabled - From usePlatformFeatureToggles
 * @returns {Array} Filtered list
 */
export function filterNavItemsByFeature(items, isFeatureEnabled) {
  if (!Array.isArray(items) || !isFeatureEnabled) return items || [];
  return items.filter((item) => {
    const path = item?.path ?? item?.href;
    if (!path) return true;
    if (!isBatch1RouteAllowed(path)) return false;
    const featureKey = getFeatureKeyForPath(path);
    if (!featureKey) return true;
    return isFeatureEnabled(featureKey);
  });
}
