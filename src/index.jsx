import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import './styles/index.css';
import './lib/i18n';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { FontSizeProvider } from './contexts/FontSizeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize Sentry error tracking via dynamic import
const SENTRY_DSN = import.meta.env?.VITE_SENTRY_DSN;
if (SENTRY_DSN && SENTRY_DSN !== 'your-sentry-dsn-here') {
  // Use a variable to prevent Rollup from statically resolving the import
  const sentryPkg = '@sentry/react';
  import(/* @vite-ignore */ sentryPkg)?.then(async (Sentry) => {
    const { sentrySlackService } = await import('./services/sentrySlackService');
    try {
      Sentry?.init({
        dsn: SENTRY_DSN,
        environment: import.meta.env?.MODE || 'production',
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        integrations: [
          Sentry?.browserTracingIntegration(),
          Sentry?.replayIntegration(),
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
  })?.catch(() => {
    console.info('[Sentry] Package not available.');
  });
} else {
  console.info('[Sentry] DSN not configured. Set VITE_SENTRY_DSN to enable error tracking.');
  console.info('[Sentry] Setup: https://sentry.io → New Project → React → copy DSN → add to .env as VITE_SENTRY_DSN=https://...');
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

const root = ReactDOM?.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <FontSizeProvider>
          <AuthProvider>
            <OnboardingProvider>
              <App />
            </OnboardingProvider>
          </AuthProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

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
