import { NOTIFICATION_COST_POLICY } from '../config/batch1ControlPolicy';

const GSM7_REGEX = /^[\x0A\x0D\x20-\x7E£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&'()*+,\-./0-9:;<=>?@A-ZÄÖÑÜ`a-zäöñüà^{}\\[~\]|€]*$/;
const URL_REGEX = /https?:\/\/[^\s]+/gi;
const SMS_ALLOWED_USE_CASES = new Set([
  'otp',
  'otp_fallback',
  'critical_security',
  'admin_message',
  'time_sensitive_admin',
]);

function stripNonGsm7(text) {
  if (!text) return '';
  return text
    .replace(/[^\x0A\x0D\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateTo160(text) {
  const safe = stripNonGsm7(text);
  if (safe.length <= NOTIFICATION_COST_POLICY.smsMaxCharacters) return safe;
  return `${safe.slice(0, NOTIFICATION_COST_POLICY.smsMaxCharacters - 1)}…`;
}

function compactUrlsForSms(text) {
  if (!text) return '';
  return text.replace(URL_REGEX, (url) => {
    try {
      const parsed = new URL(url);
      const compactPath = parsed.pathname === '/' ? '' : parsed.pathname;
      return `${parsed.hostname}${compactPath}`;
    } catch {
      return url.replace(/^https?:\/\//i, '');
    }
  });
}

export function optimizeSmsMessage(rawMessage) {
  const compacted = compactUrlsForSms(rawMessage || '');
  const base = truncateTo160(compacted);
  return {
    message: base,
    isGsm7: GSM7_REGEX.test(base),
    length: base.length,
    max: NOTIFICATION_COST_POLICY.smsMaxCharacters,
  };
}

export function isSmsAllowedUseCase(useCase) {
  return SMS_ALLOWED_USE_CASES.has(String(useCase || '').trim().toLowerCase());
}

export function buildChannelPlan({
  severity = 'medium',
  useCase = '',
  hasPushToken = true,
  hasWhatsApp = false,
  hasPhone = false,
}) {
  const isUrgent = ['critical', 'high'].includes(String(severity).toLowerCase());
  const smsAllowed = isSmsAllowedUseCase(useCase);
  const channels = [];

  if (hasPushToken) channels.push({ channel: 'push', immediate: true });

  if (isUrgent) {
    if (hasWhatsApp) channels.push({ channel: 'whatsapp', immediate: true });
    if (hasPhone && smsAllowed) channels.push({ channel: 'sms', immediate: true });
    return channels;
  }

  channels.push({ channel: 'email', immediate: true });
  if (hasWhatsApp) {
    channels.push({
      channel: 'whatsapp',
      immediate: false,
      waitHours: NOTIFICATION_COST_POLICY.pushFirstAckWindowHours,
      requiresUnackedPush: true,
    });
  }
  if (hasPhone && smsAllowed) {
    channels.push({
      channel: 'sms',
      immediate: false,
      waitHours: NOTIFICATION_COST_POLICY.pushFirstAckWindowHours,
      requiresUnackedPush: true,
    });
  }

  return channels;
}
