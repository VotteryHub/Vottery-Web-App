// Lightweight i18n implementation - no external dependencies
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English (US)', dir: 'ltr' },
  { code: 'en-GB', name: 'English (UK)', dir: 'ltr' },
  { code: 'en-IN', name: 'English (India)', dir: 'ltr' },
  { code: 'es', name: 'Spanish (Spain)', dir: 'ltr' },
  { code: 'es-MX', name: 'Spanish (Mexico)', dir: 'ltr' },
  { code: 'es-CO', name: 'Spanish (Colombia)', dir: 'ltr' },
  { code: 'es-CL', name: 'Spanish (Chile)', dir: 'ltr' },
  { code: 'es-VE', name: 'Spanish (Venezuela)', dir: 'ltr' },
  { code: 'fr', name: 'French (France)', dir: 'ltr' },
  { code: 'fr-CA', name: 'French (Canada)', dir: 'ltr' },
  { code: 'de', name: 'German', dir: 'ltr' },
  { code: 'it', name: 'Italian', dir: 'ltr' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', dir: 'ltr' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', dir: 'ltr' },
  { code: 'zh-CN', name: 'Simplified Chinese (China)', dir: 'ltr' },
  { code: 'zh-TW', name: 'Traditional Chinese (Taiwan)', dir: 'ltr' },
  { code: 'zh-HK', name: 'Traditional Chinese (Hong Kong)', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', dir: 'ltr' },
  { code: 'ko', name: 'Korean', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
  { code: 'he', name: 'Hebrew', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', dir: 'ltr' },
  { code: 'ru', name: 'Russian', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', dir: 'ltr' },
  { code: 'nl-BE', name: 'Dutch (België)', dir: 'ltr' },
  { code: 'pl', name: 'Polish', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', dir: 'ltr' },
  { code: 'da', name: 'Danish', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', dir: 'ltr' },
  { code: 'no', name: 'Norwegian (bokmal)', dir: 'ltr' },
  { code: 'cs', name: 'Czech', dir: 'ltr' },
  { code: 'el', name: 'Greek', dir: 'ltr' },
  { code: 'th', name: 'Thai', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', dir: 'ltr' },
  { code: 'ms', name: 'Malay', dir: 'ltr' },
  { code: 'tl', name: 'Filipino', dir: 'ltr' },
  { code: 'uk', name: 'Ukrainian', dir: 'ltr' },
  { code: 'ro', name: 'Romanian', dir: 'ltr' },
  { code: 'hu', name: 'Hungarian', dir: 'ltr' },
  { code: 'sk', name: 'Slovak', dir: 'ltr' },
  { code: 'bg', name: 'Bulgarian', dir: 'ltr' },
  { code: 'hr', name: 'Croatian', dir: 'ltr' },
  { code: 'sr', name: 'Serbian', dir: 'ltr' },
  { code: 'sl', name: 'Slovenian', dir: 'ltr' },
  { code: 'et', name: 'Estonian', dir: 'ltr' },
  { code: 'lv', name: 'Latvian', dir: 'ltr' },
  { code: 'lt', name: 'Lithuanian', dir: 'ltr' },
  { code: 'is', name: 'Icelandic', dir: 'ltr' },
  { code: 'ga', name: 'Irish', dir: 'ltr' },
  { code: 'cy', name: 'Welsh', dir: 'ltr' },
  { code: 'eu', name: 'Basque', dir: 'ltr' },
  { code: 'ca', name: 'Catalan', dir: 'ltr' },
  { code: 'gl', name: 'Galician', dir: 'ltr' },
  { code: 'af', name: 'Afrikaans', dir: 'ltr' },
  { code: 'sw', name: 'Swahili', dir: 'ltr' },
  { code: 'zu', name: 'Zulu', dir: 'ltr' },
  { code: 'xh', name: 'Xhosa', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', dir: 'ltr' },
  { code: 'te', name: 'Telugu', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', dir: 'rtl' },
  { code: 'fa', name: 'Persian', dir: 'rtl' }
];

const RTL_LANGUAGES = new Set(['ar', 'he', 'ur', 'fa', 'ps', 'syr', 'yi']);

let currentLanguage = localStorage?.getItem('i18nextLng') || 
  navigator?.language?.split('-')?.[0] || 'en';
let translations = {};
let listeners = [];

const loadTranslations = async (lng) => {
  const baseLng = lng?.split('-')?.[0] || 'en';
  const supported = ['en', 'es', 'fr'];
  const targetLng = supported?.includes(baseLng) ? baseLng : 'en';
  try {
    const response = await fetch(`/locales/${targetLng}/translation.json`);
    if (response?.ok) {
      translations = await response?.json();
    }
  } catch {
    translations = {};
  }
};

const updateDocumentDir = (lng) => {
  const language = SUPPORTED_LANGUAGES?.find(l => l?.code === lng || l?.code === lng?.split('-')?.[0]);
  const dir = language?.dir || (RTL_LANGUAGES?.has(lng?.split('-')?.[0]) ? 'rtl' : 'ltr');
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

const i18n = {
  language: currentLanguage,
  isInitialized: false,

  use: () => i18n,

  init: async (options) => {
    await loadTranslations(currentLanguage);
    updateDocumentDir(currentLanguage);
    i18n.isInitialized = true;
    i18n.language = currentLanguage;
    return i18n;
  },

  t: (key, options) => {
    if (!key) return '';
    const keys = key?.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    if (typeof value === 'string') {
      if (options) {
        return value?.replace(/\{\{(\w+)\}\}/g, (_, k) => options?.[k] ?? `{{${k}}}`);
      }
      return value;
    }
    return key;
  },

  changeLanguage: async (lng) => {
    currentLanguage = lng;
    i18n.language = lng;
    localStorage?.setItem('i18nextLng', lng);
    await loadTranslations(lng);
    updateDocumentDir(lng);
    listeners?.forEach(cb => cb(lng));
  },

  on: (event, callback) => {
    if (event === 'languageChanged') {
      listeners?.push(callback);
    }
  },

  off: (event, callback) => {
    if (event === 'languageChanged') {
      listeners = listeners?.filter(cb => cb !== callback);
    }
  }
};

// Auto-initialize
i18n?.init({});

export { SUPPORTED_LANGUAGES };
export default i18n;