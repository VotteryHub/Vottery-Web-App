import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { localizationService } from '../../../services/localizationService';
import i18n from '../../../lib/i18n';

const useTranslation = () => ({ t: i18n?.t?.bind(i18n), i18n });


const MultiLanguageIntelligencePanel = () => {
  const { i18n } = useTranslation();
  const [translationStatus, setTranslationStatus] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n?.language || 'en-US');
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  const SUPPORTED_LANGUAGES = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸', speakers: '1.5B' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', speakers: '559M' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳', speakers: '1.1B' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', speakers: '602M' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', speakers: '422M', rtl: true },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷', speakers: '280M' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', speakers: '258M' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷', speakers: '234M' },
    { code: 'de', name: 'German', flag: '🇩🇪', speakers: '134M' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', speakers: '125M' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', speakers: '81M' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', speakers: '85M' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷', speakers: '88M' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱', speakers: '25M' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱', speakers: '45M' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱', speakers: '9M', rtl: true },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰', speakers: '231M', rtl: true },
    { code: 'fa', name: 'Persian', flag: '🇮🇷', speakers: '110M', rtl: true },
    { code: 'th', name: 'Thai', flag: '🇹🇭', speakers: '60M' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', speakers: '85M' }
  ];

  useEffect(() => {
    loadTranslationStatus();
  }, []);

  const loadTranslationStatus = async () => {
    try {
      setLoading(true);
      const result = await localizationService?.getTranslationStatus();
      if (result?.success) {
        setTranslationStatus(result?.translations || []);
      }
    } catch (error) {
      console.error('Error loading translation status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (languageCode) => {
    try {
      setTranslating(true);
      const result = await localizationService?.changeLanguage(languageCode);
      if (result?.success) {
        setSelectedLanguage(languageCode);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setTranslating(false);
    }
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Translation Engine */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Languages" size={20} className="text-blue-500" />
            AI Translation Engine
          </h3>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
              61 Languages Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUPPORTED_LANGUAGES?.map((lang) => (
            <div
              key={lang?.code}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedLanguage === lang?.code
                  ? 'border-primary bg-primary/5' :'border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }`}
              onClick={() => handleLanguageChange(lang?.code)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang?.flag}</span>
                  <div>
                    <div className="font-semibold text-foreground">{lang?.name}</div>
                    <div className="text-xs text-muted-foreground">{lang?.speakers} speakers</div>
                  </div>
                </div>
                {lang?.rtl && (
                  <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                    RTL
                  </div>
                )}
              </div>
              {selectedLanguage === lang?.code && (
                <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                  <Icon name="CheckCircle" size={16} />
                  <span>Active</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Adaptation Algorithms */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Brain" size={20} className="text-purple-500" />
            Cultural Adaptation Algorithms
          </h3>
          <Button size="sm" className="flex items-center gap-2">
            <Icon name="Settings" size={16} />
            Configure
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Icon name="Calendar" size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">Date & Time Formats</div>
                <div className="text-sm text-muted-foreground">Regional formatting</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">US Format:</span>
                <span className="font-medium text-foreground">MM/DD/YYYY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">EU Format:</span>
                <span className="font-medium text-foreground">DD/MM/YYYY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISO Format:</span>
                <span className="font-medium text-foreground">YYYY-MM-DD</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 text-white rounded-lg">
                <Icon name="DollarSign" size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">Currency Localization</div>
                <div className="text-sm text-muted-foreground">Multi-currency support</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">USD:</span>
                <span className="font-medium text-foreground">$1,234.56</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">EUR:</span>
                <span className="font-medium text-foreground">€1.234,56</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">INR:</span>
                <span className="font-medium text-foreground">₹1,234.56</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500 text-white rounded-lg">
                <Icon name="Type" size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">Text Direction</div>
                <div className="text-sm text-muted-foreground">RTL/LTR support</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">LTR Languages:</span>
                <span className="font-medium text-foreground">54</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RTL Languages:</span>
                <span className="font-medium text-foreground">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auto-Detection:</span>
                <span className="font-medium text-green-600 dark:text-green-400">Enabled</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 text-white rounded-lg">
                <Icon name="Globe" size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">Regional Content</div>
                <div className="text-sm text-muted-foreground">Geo-specific optimization</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Regions:</span>
                <span className="font-medium text-foreground">195</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content Variants:</span>
                <span className="font-medium text-foreground">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adaptation Rate:</span>
                <span className="font-medium text-green-600 dark:text-green-400">98.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Translation Completion Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="BarChart3" size={20} className="text-green-500" />
            Translation Completion Status
          </h3>
          <Button size="sm" className="flex items-center gap-2">
            <Icon name="Download" size={16} />
            Export Report
          </Button>
        </div>

        <div className="space-y-3">
          {SUPPORTED_LANGUAGES?.slice(0, 10)?.map((lang, index) => {
            const completion = 85 + Math.random() * 15; // Simulated completion percentage
            return (
              <div key={lang?.code} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-48">
                  <span className="text-xl">{lang?.flag}</span>
                  <span className="text-sm font-medium text-foreground">{lang?.name}</span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
                <div className={`text-sm font-semibold w-16 text-right ${getCompletionColor(completion)}`}>
                  {completion?.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultiLanguageIntelligencePanel;