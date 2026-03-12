// IP geolocation validation with country-based access controls

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

interface GeolocationResult {
  allowed: boolean;
  country?: string;
  region?: string;
  reason?: string;
}

// Blocked countries (example - adjust based on requirements)
const BLOCKED_COUNTRIES = [
  'KP', // North Korea
  'IR', // Iran
  'SY', // Syria
  'CU', // Cuba
];

// High-risk countries requiring additional verification
const HIGH_RISK_COUNTRIES = [
  'CN', // China
  'RU', // Russia
  'VN', // Vietnam
];

export const validateIPGeolocation = async (
  ipAddress: string
): Promise<GeolocationResult> => {
  try {
    // Use ipapi.co for geolocation (free tier available)
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    
    if (!response.ok) {
      console.warn(`Geolocation API error for IP ${ipAddress}`);
      return { allowed: true }; // Fail open
    }

    const data = await response.json();
    const countryCode = data.country_code;

    // Check if country is blocked
    if (BLOCKED_COUNTRIES.includes(countryCode)) {
      return {
        allowed: false,
        country: countryCode,
        region: data.region,
        reason: 'Country blocked due to regulatory restrictions'
      };
    }

    // Flag high-risk countries for additional monitoring
    if (HIGH_RISK_COUNTRIES.includes(countryCode)) {
      console.warn(`High-risk country access: ${countryCode} from IP ${ipAddress}`);
      // Log to security monitoring
      await logSecurityEvent({
        event_type: 'high_risk_country_access',
        ip_address: ipAddress,
        country: countryCode,
        region: data.region,
        timestamp: new Date().toISOString()
      });
    }

    return {
      allowed: true,
      country: countryCode,
      region: data.region
    };
  } catch (error) {
    console.error('IP geolocation validation error:', error);
    // Fail open but log the error
    return { allowed: true };
  }
};

export const validateIPForSensitiveOperation = async (
  ipAddress: string
): Promise<boolean> => {
  const result = await validateIPGeolocation(ipAddress);
  
  if (!result.allowed) {
    await logSecurityEvent({
      event_type: 'blocked_country_attempt',
      ip_address: ipAddress,
      country: result.country,
      reason: result.reason,
      timestamp: new Date().toISOString()
    });
    return false;
  }

  return true;
};

const logSecurityEvent = async (event: any): Promise<void> => {
  try {
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/security_events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify(event)
      }
    );
    
    if (!response.ok) {
      console.error('Failed to log security event');
    }
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};