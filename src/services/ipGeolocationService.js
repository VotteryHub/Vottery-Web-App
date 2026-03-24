import { supabase } from '../lib/supabase';
import { countryRestrictionsService } from './countryRestrictionsService';

/**
 * IP Geolocation Validation Service
 * Provides country-based access controls and geographic threat detection
 */

class IPGeolocationService {
  constructor() {
    this.blockedCountries = ['XX', 'YY']; // Configure blocked countries
    this.allowedCountries = []; // Empty = allow all except blocked
    this.cache = new Map();
    this.cacheExpiry = 3600000; // 1 hour
  }

  /**
   * Get geolocation data from IP address
   */
  async getGeolocation(ipAddress) {
    try {
      // Check cache first
      const cached = this.cache?.get(ipAddress);
      if (cached && Date.now() - cached?.timestamp < this.cacheExpiry) {
        return cached?.data;
      }

      // Use free IP geolocation API (ip-api.com)
      const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
      
      if (!response?.ok) {
        throw new Error('Geolocation API request failed');
      }

      const data = await response?.json();
      
      if (data?.status === 'fail') {
        throw new Error(data.message || 'Geolocation lookup failed');
      }

      // Cache the result
      this.cache?.set(ipAddress, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Geolocation lookup error:', error);
      throw error;
    }
  }

  /**
   * Validate if IP address is allowed based on country rules
   */
  async validateAccess(ipAddress) {
    try {
      const geoData = await this.getGeolocation(ipAddress);
      const countryCode = geoData?.countryCode;
      const enabledByAdmin = await countryRestrictionsService.isCountryEnabled(
        countryCode
      );
      if (!enabledByAdmin) {
        return {
          allowed: false,
          reason: 'country_restricted_by_admin',
          country: geoData?.country,
          countryCode,
          geoData
        };
      }

      return {
        allowed: true,
        country: geoData?.country,
        countryCode,
        geoData
      };
    } catch (error) {
      console.error('Access validation error:', error);
      // On error, allow access but log the incident
      return {
        allowed: true,
        error: error?.message,
        fallback: true
      };
    }
  }

  /**
   * Log geolocation access attempt
   */
  async logAccessAttempt(ipAddress, userId, action, allowed) {
    try {
      const geoData = await this.getGeolocation(ipAddress);
      
      const { error } = await supabase?.from('security_geo_logs')?.insert({
          ip_address: ipAddress,
          user_id: userId,
          action,
          allowed,
          country: geoData?.country,
          country_code: geoData?.countryCode,
          city: geoData?.city,
          region: geoData?.regionName,
          isp: geoData?.isp,
          latitude: geoData?.lat,
          longitude: geoData?.lon,
          geo_data: geoData
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to log access attempt:', error);
    }
  }

  /**
   * Get geographic threat statistics
   */
  async getGeoThreatStats(timeRange = '24h') {
    try {
      const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
      const startTime = new Date(Date.now() - hours * 60 * 60 * 1000)?.toISOString();

      const { data, error } = await supabase?.from('security_geo_logs')?.select('*')?.gte('created_at', startTime)?.order('created_at', { ascending: false });

      if (error) throw error;

      // Aggregate statistics
      const stats = {
        totalAttempts: data?.length,
        blockedAttempts: data?.filter(log => !log?.allowed)?.length,
        allowedAttempts: data?.filter(log => log?.allowed)?.length,
        countriesDetected: [...new Set(data.map(log => log.country_code))]?.length,
        topCountries: this.getTopCountries(data),
        topBlockedCountries: this.getTopCountries(data?.filter(log => !log?.allowed)),
        recentBlocks: data?.filter(log => !log?.allowed)?.slice(0, 10)
      };

      return stats;
    } catch (error) {
      console.error('Failed to get geo threat stats:', error);
      throw error;
    }
  }

  /**
   * Get top countries from logs
   */
  getTopCountries(logs) {
    const countryCounts = {};
    logs?.forEach(log => {
      const key = `${log?.country_code}|${log?.country}`;
      countryCounts[key] = (countryCounts?.[key] || 0) + 1;
    });

    return Object.entries(countryCounts)?.map(([key, count]) => {
        const [code, name] = key?.split('|');
        return { code, name, count };
      })?.sort((a, b) => b?.count - a?.count)?.slice(0, 10);
  }

  /**
   * Update blocked countries list
   */
  updateBlockedCountries(countries) {
    this.blockedCountries = countries;
  }

  /**
   * Update allowed countries list
   */
  updateAllowedCountries(countries) {
    this.allowedCountries = countries;
  }

  /**
   * Get current IP address of client
   */
  async getCurrentIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response?.json();
      return data?.ip;
    } catch (error) {
      console.error('Failed to get current IP:', error);
      return null;
    }
  }

  /**
   * Detect VPN/Proxy usage
   */
  async detectVPN(ipAddress) {
    try {
      const geoData = await this.getGeolocation(ipAddress);
      
      // Basic VPN detection heuristics
      const vpnIndicators = {
        isVPN: false,
        indicators: []
      };

      // Check if ISP contains VPN-related keywords
      const vpnKeywords = ['vpn', 'proxy', 'hosting', 'datacenter', 'cloud'];
      const ispLower = (geoData?.isp || '')?.toLowerCase();
      
      if (vpnKeywords?.some(keyword => ispLower?.includes(keyword))) {
        vpnIndicators.isVPN = true;
        vpnIndicators?.indicators?.push('ISP contains VPN/proxy keywords');
      }

      return vpnIndicators;
    } catch (error) {
      console.error('VPN detection error:', error);
      return { isVPN: false, error: error?.message };
    }
  }
}

export default new IPGeolocationService();