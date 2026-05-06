import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { Breadcrumbs } from "./components/Breadcrumbs";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingRedirect from "./components/OnboardingRedirect";
import { FeatureGateByPath } from "./components/FeatureGate";
import { navigationService } from "./services/navigationService";
import { isBatch1RouteAllowed } from "./config/batch1RouteAllowlist";
import { composeRouteModules } from "./routes/composeRouteModules";
import { getFoundationalRoutes } from "./routes/modules/foundationalRoutes";
import { getModuleRoutes } from "./routes/modules/moduleRoutes";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";

/**
 * K7 Kernel — Page loading skeleton.
 * Shown while any lazy-loaded page chunk is being fetched.
 */
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

/**
 * Per-route error fallback.
 * A single broken module route should NEVER crash other routes.
 * This renders instead of the crashed route and lets the user navigate away.
 */
const RouteErrorFallback = ({ routePath }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8">
    <div className="text-center max-w-sm">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        This page failed to load
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        An unexpected error occurred in this section. Other parts of the app
        are not affected.
      </p>
      {import.meta.env.DEV && (
        <p className="text-xs text-muted-foreground font-mono bg-muted rounded px-2 py-1 mb-4">
          Path: {routePath}
        </p>
      )}
      <a
        href="/home-feed-dashboard"
        className="inline-block bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Go to Home Feed
      </a>
    </div>
  </div>
);

/**
 * Wraps a route element in an ErrorBoundary so a crashing module
 * doesn't take down the entire RouterRoutes tree.
 */
function SafeRouteElement({ routeElement }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>{routeElement}</Suspense>
    </ErrorBoundary>
  );
}

/**
 * Protects routes by role. Uses navigationService to map path to roles.
 */
function wrapWithRoleGuard(path, element) {
  const requiredRoles = navigationService?.getRequiredRolesForPath(path);
  return requiredRoles ? (
    <ProtectedRoute path={path} requiredRoles={requiredRoles}>
      {element}
    </ProtectedRoute>
  ) : (
    element
  );
}

/**
 * Main Application Routing.
 *
 * Architecture (per Vottery Kernel Map):
 *  - K7: This file IS the routing shell. Always rendered.
 *  - Kernel routes (K1-K7): getFoundationalRoutes() — always enabled.
 *  - Module routes (M1-M9): getModuleRoutes() — gated by FeatureGateByPath.
 *
 * Each route is wrapped in its own <ErrorBoundary> so one failing module
 * never crashes the router or any other route.
 */
function Routes() {
  // Compose all route groups. Last definition wins for overrides.
  const routes = composeRouteModules(getFoundationalRoutes(), getModuleRoutes());

  return (
    <BrowserRouter>
      <OnboardingRedirect>
        {/* K7: Outer boundary — catches catastrophic failures in the routing shell itself */}
        <ErrorBoundary>
          <ScrollToTop />
          <Breadcrumbs />
          <RouterRoutes>
            {/*
             * Route rendering order:
             * 1. Kernel routes (always present via isBatch1RouteAllowed)
             * 2. Module routes (gated by FeatureGateByPath — returns /403 if disabled)
             * 3. Error / utility routes
             * 4. Catch-all → NotFound
             */}
            {routes
              .filter((route) => route && isBatch1RouteAllowed(route?.path))
              .map((route, index) => {
                if (!route) return null;
                const element = (
                  <FeatureGateByPath path={route?.path}>
                    {route?.element}
                  </FeatureGateByPath>
                );
                return (
                  <Route
                    key={`${route.path}-${index}`}
                    path={route?.path}
                    element={
                      <SafeRouteElement
                        routeElement={wrapWithRoleGuard(route?.path, element)}
                      />
                    }
                  />
                );
              })}

            {/* Error & utility routes — always present (K7) */}
            <Route path="/403" element={<AccessDenied />} />
            <Route path="/404" element={<NotFound />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </OnboardingRedirect>
    </BrowserRouter>
  );
}

export default Routes;
