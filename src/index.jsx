import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import './styles/index.css';
import './styles/premium.css';
import './lib/i18n';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { FontSizeProvider } from './contexts/FontSizeContext';
import ErrorBoundary from './components/ErrorBoundary';
import ContextualHelpOverlay from './components/ui/ContextualHelpOverlay';
import useFeatureStore from './store/useFeatureStore';
import { env } from './config/env.config';

import { eventBusRecorder } from './services/eventBusRecorder';
import { eventBus, EVENTS } from './lib/eventBus';

// Initialize the platform event recorder
eventBusRecorder.initialize();

// Emit initial system event
eventBus.emit(EVENTS.SITE_LOADED, { timestamp: new Date().toISOString() });

/**
 * K2 Kernel — Initializes global application state (feature flags).
 * Renders a spinner until the feature-flag engine is ready.
 * The feature store has a 6-second timeout so this NEVER blocks forever.
 */
const AppInitializer = ({ children }) => {
  const fetchFeatures = useFeatureStore((state) => state.fetchFeatures);
  const initialized = useFeatureStore((state) => state.initialized);
  const featureError = useFeatureStore((state) => state.error);

  React.useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  // Dev-only: warn if Supabase is unconfigured
  const supabaseConfigured = !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  if (!initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        {import.meta.env.DEV && !supabaseConfigured && (
          <div className="max-w-md p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>Dev Warning:</strong> VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.
            The app will boot in 6 seconds with all features disabled. Check your <code>.env</code> file.
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {import.meta.env.DEV && featureError && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-xs text-center px-4 py-1">
          ⚠️ Feature flags unavailable: {featureError} — app running with all flags defaulted to OFF.
        </div>
      )}
      {children}
    </>
  );
};

// Initialize Sentry error tracking
const SENTRY_DSN = env.VITE_SENTRY_DSN;
if (SENTRY_DSN && SENTRY_DSN !== 'your-sentry-dsn-here') {
  import('@sentry/react').then(async (Sentry) => {
    const { sentrySlackService } = await import('./services/sentrySlackService');
    try {
      Sentry.init({
        dsn: SENTRY_DSN,
        environment: env.VITE_ENV,
        tracesSampleRate: env.VITE_ENV === 'production' ? 0.1 : (env.VITE_ENV === 'staging' ? 0.5 : 1.0),
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
        ],
        beforeSend(event, hint) {
          const level = event?.level || 'error';
          if (level === 'fatal' || level === 'error') {
            sentrySlackService?.notifyCriticalError?.({
              title: event?.message || 'Unhandled Error',
              message: hint?.originalException?.message || event?.message || 'No details',
              level,
              extra: { event_id: event?.event_id },
            });
          }
          return event;
        },
      });
      console.info('[Sentry] Error tracking initialized.');
    } catch (e) {
      console.warn('[Sentry] Failed to initialize:', e);
    }
  });
}

// Initialize Datadog RUM SDK for distributed tracing
const initDatadog = () => {
  const applicationId = import.meta.env?.VITE_DATADOG_APPLICATION_ID;
  const clientToken = import.meta.env?.VITE_DATADOG_CLIENT_TOKEN;
  const site = import.meta.env?.VITE_DATADOG_SITE || 'datadoghq.com';
  const service = import.meta.env?.VITE_DATADOG_SERVICE || 'vottery-web';
  const env = import.meta.env?.VITE_DATADOG_ENV || 'production';

  if (!applicationId || !clientToken ||
      applicationId === 'your-datadog-application-id-here' ||
      clientToken === 'your-datadog-client-token-here') {
    console.info('[Datadog] APM not initialized — missing credentials.');
    console.info('[Datadog] Setup: https://app.datadoghq.com → UX Monitoring → RUM Applications → New Application → React');
    console.info('[Datadog] Add to .env: VITE_DATADOG_APPLICATION_ID=... and VITE_DATADOG_CLIENT_TOKEN=...');
    return;
  }

  // Load real @datadog/browser-rum SDK
  import(/* @vite-ignore */ '@datadog/browser-rum')?.then(({ datadogRum }) => {
    try {
      datadogRum?.init({
        applicationId,
        clientToken,
        site,
        service,
        env,
        version: '1.0.0',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input',
        allowedTracingUrls: [
          import.meta.env?.VITE_SUPABASE_URL,
          import.meta.env?.VITE_API_URL,
          import.meta.env?.VITE_AWS_LAMBDA_CHAT_COMPLETION_URL,
          import.meta.env?.VITE_AWS_LAMBDA_IMAGE_GENERATION_URL,
          import.meta.env?.VITE_AWS_LAMBDA_IMAGE_EDIT_URL,
        ]?.filter(Boolean),
      });
      datadogRum?.startSessionReplayRecording();
      console.info('[Datadog] Real RUM SDK initialized with distributed tracing.');
    } catch (err) {
      console.warn('[Datadog] Failed to initialize RUM SDK:', err?.message);
    }
  })?.catch(() => {
    // Fallback to CDN script if package import fails
    const script = document.createElement('script');
    script.src = 'https://www.datadoghq-browser-agent.com/us1/v5/datadog-rum.js';
    script.async = true;
    script.onload = () => {
      try {
        const ddRum = window.DD_RUM;
        if (!ddRum) return;
        ddRum?.init({ applicationId, clientToken, site, service, env, version: '1.0.0', sessionSampleRate: 100, trackUserInteractions: true, trackResources: true, trackLongTasks: true, defaultPrivacyLevel: 'mask-user-input' });
        ddRum?.startSessionReplayRecording();
        console.info('[Datadog] RUM SDK initialized via CDN fallback.');
      } catch (err) {
        console.warn('[Datadog] CDN fallback init failed:', err?.message);
      }
    };
    document.head?.appendChild(script);
  });
};

initDatadog();

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <FontSizeProvider>
            <AuthProvider>
              <OnboardingProvider>
                <AppInitializer>
                  <App />
                  <ContextualHelpOverlay />
                </AppInitializer>
              </OnboardingProvider>
            </AuthProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('CRITICAL: Failed to mount Vottery App:', error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Failed to Load Vottery</h1><p>${error.message}</p></div>`;
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker?.register('/service-worker.js')?.then((registration) => {
        console.log('Service Worker registered:', registration);
        setInterval(() => { registration?.update(); }, 60 * 60 * 1000);
        registration?.addEventListener('updatefound', () => {
          const newWorker = registration?.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker?.state === 'installed' && navigator.serviceWorker?.controller) {
              if (confirm('New version available! Reload to update?')) {
                newWorker?.postMessage({ type: 'SKIP_WAITING' });
                window.location?.reload();
              }
            }
          });
        });
      })?.catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
