export function composeRouteModules(...routeGroups) {
  const deduped = new Map();

  routeGroups
    .flat()
    .filter(Boolean)
    .forEach((route) => {
      if (!route?.path) return;
      // Last definition wins so feature modules can intentionally override legacy entries.
      deduped.set(route.path, route);
    });

  return Array.from(deduped.values());
}
