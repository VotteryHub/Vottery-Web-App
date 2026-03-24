import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../AppIcon';
import { generateContent } from '../../services/geminiChatService';
import {
  AGE_VERIFICATION_DIGITAL_IDENTITY_CENTER_ROUTE,
  ELECTIONS_DASHBOARD_ROUTE,
  ELECTION_CREATION_STUDIO_ROUTE,
  GLOBAL_LOCALIZATION_CONTROL_CENTER_ROUTE,
  LIVE_QUESTION_INJECTION_MANAGEMENT_CENTER_ROUTE,
  MULTI_AUTHENTICATION_GATEWAY_ROUTE,
  PRESENTATION_BUILDER_AUDIENCE_Q_A_HUB_ROUTE,
  SETTINGS_ACCOUNT_DASHBOARD_ROUTE,
  USER_SECURITY_CENTER_ROUTE,
} from '../../constants/navigationHubRoutes';

const HELP_CONTENT = {
  [MULTI_AUTHENTICATION_GATEWAY_ROUTE]: 'Choose and configure secure sign-in methods including social login, passkeys, and OTP options.',
  [USER_SECURITY_CENTER_ROUTE]: 'Review threat signals, device trust, active sessions, and two-factor authentication settings.',
  [ELECTION_CREATION_STUDIO_ROUTE]: 'Build and publish elections with voting rules, participation controls, and visibility settings.',
  [ELECTIONS_DASHBOARD_ROUTE]: 'Track elections by lifecycle status, monitor participation, and run management actions.',
  [GLOBAL_LOCALIZATION_CONTROL_CENTER_ROUTE]: 'Set language, text direction, and regional formatting preferences.',
  [AGE_VERIFICATION_DIGITAL_IDENTITY_CENTER_ROUTE]: 'Complete identity checks, age assurance, and credential wallet verification.',
  [PRESENTATION_BUILDER_AUDIENCE_Q_A_HUB_ROUTE]: 'Build presentation sessions and moderate live audience questions in real time.',
  [LIVE_QUESTION_INJECTION_MANAGEMENT_CENTER_ROUTE]: 'Inject and broadcast new questions into active elections while tracking response analytics.',
  [SETTINGS_ACCOUNT_DASHBOARD_ROUTE]: 'Manage account profile, privacy, security controls, exports, and integrations.',
};

const ContextualHelpOverlay = () => {
  const [open, setOpen] = useState(false);
  const [elementHelpText, setElementHelpText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const pathname = window?.location?.pathname || '/';

  const helpText = useMemo(() => {
    return HELP_CONTENT?.[pathname] || 'This screen provides controls and analytics for the current workflow. Use visible actions to continue.';
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const buildElementHelp = (target) => {
      if (!(target instanceof HTMLElement)) return '';
      const inHelpOverlay = target.closest('[data-contextual-help-overlay="true"]');
      if (inHelpOverlay) return '';

      const label =
        target.getAttribute('data-help') ||
        target.getAttribute('aria-label') ||
        target.getAttribute('title') ||
        target.innerText?.trim()?.slice(0, 90) ||
        target.id ||
        target.className?.toString()?.slice(0, 60);

      if (!label) return '';
      return `Selected element: "${label}". This control helps you complete the current workflow safely and accurately.`;
    };

    const buildAiElementHelp = async (label) => {
      if (!label) return '';
      try {
        setAiLoading(true);
        const response = await generateContent(
          [
            {
              role: 'system',
              content:
                'You create concise in-product guidance. Return plain text only, max 2 short sentences.',
            },
            {
              role: 'user',
              content: `Path: ${pathname}
Selected UI element: ${label}
Base screen guidance: ${helpText}
Generate contextual help explaining what this element does and what to do next.`,
            },
          ],
          { max_completion_tokens: 120 }
        );
        return response?.choices?.[0]?.message?.content?.trim() || '';
      } catch {
        return '';
      } finally {
        setAiLoading(false);
      }
    };

    const handlePointerDown = (event) => {
      const dynamicHelp = buildElementHelp(event.target);
      if (dynamicHelp) {
        setElementHelpText(dynamicHelp);
      }
      const target = event?.target;
      const label =
        target?.getAttribute?.('data-help') ||
        target?.getAttribute?.('aria-label') ||
        target?.getAttribute?.('title') ||
        target?.innerText?.trim()?.slice(0, 90);
      if (label) {
        buildAiElementHelp(label).then((aiHelp) => {
          if (aiHelp) setElementHelpText(aiHelp);
        });
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-[2000]" data-contextual-help-overlay="true">
      {open && (
        <div className="mb-2 max-w-sm rounded-xl border border-border bg-card p-4 shadow-lg">
          <div className="flex items-start gap-2">
            <Icon name="HelpCircle" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">What is this?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {aiLoading ? 'Generating contextual guidance...' : (elementHelpText || helpText)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2">
                Tip: while help is open, tap or click any UI element for contextual guidance.
              </p>
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-primary text-white px-4 py-2 text-sm font-medium shadow-md hover:opacity-90"
      >
        {open ? 'Hide Help' : 'What is this?'}
      </button>
    </div>
  );
};

export default ContextualHelpOverlay;
