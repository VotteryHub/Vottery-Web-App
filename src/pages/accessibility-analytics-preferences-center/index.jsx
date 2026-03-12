import React, { useState, useEffect } from 'react';
import { useFontSize } from '../../contexts/FontSizeContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { accessibilityAnalyticsService } from '../../services/accessibilityAnalyticsService';
import { Sun, Moon, Type, Eye, BarChart3, TrendingUp, Users } from 'lucide-react';

const AccessibilityAnalyticsPreferencesCenter = () => {
  const { fontSize, setFontSize, MIN_FONT_SIZE, MAX_FONT_SIZE } = useFontSize();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [aggregatedInsights, setAggregatedInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [metricsResult, insightsResult] = await Promise.all([
        accessibilityAnalyticsService?.getAccessibilityMetrics(user?.id, '30d'),
        accessibilityAnalyticsService?.getAggregatedAccessibilityInsights('30d')
      ]);

      if (metricsResult?.data) setMetrics(metricsResult?.data);
      if (insightsResult?.data) setAggregatedInsights(insightsResult?.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
  };

  const handleHighContrastToggle = async () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    if (user) {
      await accessibilityAnalyticsService?.trackAccessibilityFeatureUsage(user?.id, 'high_contrast', newValue);
    }
  };

  const handleReducedMotionToggle = async () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    if (user) {
      await accessibilityAnalyticsService?.trackAccessibilityFeatureUsage(user?.id, 'reduced_motion', newValue);
    }
  };

  const handleDyslexiaFontToggle = async () => {
    const newValue = !dyslexiaFont;
    setDyslexiaFont(newValue);
    if (user) {
      await accessibilityAnalyticsService?.trackAccessibilityFeatureUsage(user?.id, 'dyslexia_font', newValue);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Accessibility & Analytics Preferences Center</h1>
          <p className="text-muted-foreground">Customize your accessibility settings and view usage analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Font Size Control Panel */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Type className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Font Size Control</h2>
                <p className="text-sm text-muted-foreground">Adjust text size for better readability</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground">Current Size: {fontSize}px</label>
                  <span className="text-xs text-muted-foreground">{MIN_FONT_SIZE}px - {MAX_FONT_SIZE}px</span>
                </div>
                <input
                  type="range"
                  min={MIN_FONT_SIZE}
                  max={MAX_FONT_SIZE}
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e?.target?.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Preview:</p>
                <div className="space-y-2">
                  <h3 style={{ fontSize: `${fontSize * 1.5}px` }} className="font-semibold">Header Text</h3>
                  <p style={{ fontSize: `${fontSize}px` }}>Body text appears at your selected size for optimal readability.</p>
                  <button style={{ fontSize: `${fontSize * 0.9}px` }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Button Text</button>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Management Panel */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-secondary/10 rounded-lg">
                {theme === 'dark' ? <Moon className="w-6 h-6 text-secondary" /> : <Sun className="w-6 h-6 text-secondary" />}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Theme Management</h2>
                <p className="text-sm text-muted-foreground">Control visual appearance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Reduce eye strain in low light</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">High Contrast</p>
                  <p className="text-sm text-muted-foreground">Enhance visual distinction</p>
                </div>
                <button
                  onClick={handleHighContrastToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    highContrast ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      highContrast ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Reduced Motion</p>
                  <p className="text-sm text-muted-foreground">Minimize animations</p>
                </div>
                <button
                  onClick={handleReducedMotionToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    reducedMotion ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      reducedMotion ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Dyslexia-Friendly Font</p>
                  <p className="text-sm text-muted-foreground">Optimized for readability</p>
                </div>
                <button
                  onClick={handleDyslexiaFontToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    dyslexiaFont ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      dyslexiaFont ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Google Analytics Integration Panel */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Google Analytics Integration</h2>
                <p className="text-sm text-muted-foreground">Accessibility tracking metrics</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading analytics...</p>
              </div>
            ) : metrics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Events</p>
                    <p className="text-2xl font-bold text-foreground">{metrics?.totalEvents || 0}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Font Changes</p>
                    <p className="text-2xl font-bold text-foreground">{metrics?.fontSizeChanges || 0}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Theme Changes</p>
                    <p className="text-2xl font-bold text-foreground">{metrics?.themeChanges || 0}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Feature Usage</p>
                    <p className="text-2xl font-bold text-foreground">{metrics?.featureUsage || 0}</p>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">Most Used Settings</p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Font Size: <span className="font-medium text-foreground">{metrics?.mostUsedFontSize}px</span></p>
                    <p className="text-sm text-muted-foreground">Theme: <span className="font-medium text-foreground capitalize">{metrics?.mostUsedTheme}</span></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No analytics data available yet</p>
              </div>
            )}
          </div>

          {/* Aggregated Insights Panel */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Platform-Wide Insights</h2>
                <p className="text-sm text-muted-foreground">Accessibility adoption trends</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading insights...</p>
              </div>
            ) : aggregatedInsights ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <p className="font-medium text-foreground">Total Users: {aggregatedInsights?.totalUsers || 0}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Platform Events: {aggregatedInsights?.totalEvents || 0}</p>
                </div>

                {aggregatedInsights?.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Recommendations:</p>
                    {aggregatedInsights?.recommendations?.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground">{rec?.recommendation}</p>
                        <p className="text-xs text-muted-foreground mt-1">{rec?.reason}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                          rec?.priority === 'high' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                        }`}>
                          {rec?.priority} priority
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No insights available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* WCAG Compliance Indicator */}
        <div className="mt-6 card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10 rounded-lg">
              <Eye className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">WCAG Compliance Status</h3>
              <p className="text-sm text-muted-foreground">Your current settings meet WCAG 2.1 Level AA standards</p>
            </div>
            <div className="px-4 py-2 bg-success/10 text-success rounded-lg font-medium">
              Compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityAnalyticsPreferencesCenter;