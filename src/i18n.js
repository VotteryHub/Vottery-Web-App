// Lightweight i18n implementation - no external dependencies
export const LANGUAGE_METADATA = {
  'ar': { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  'he': { name: 'Hebrew', nativeName: 'עברית', dir: 'rtl' },
  'ur': { name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  'fa': { name: 'Persian', nativeName: 'فارسی', dir: 'rtl' },
  'ps': { name: 'Pashto', nativeName: 'پښتو', dir: 'rtl' },
  'syr': { name: 'Syriac', nativeName: 'ܣܘܪܝܝܐ', dir: 'rtl' },
  'yi': { name: 'Yiddish', nativeName: 'ייִדיש', dir: 'rtl' },
  'en-US': { name: 'English (US)', nativeName: 'English (US)', dir: 'ltr' },
  'es': { name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  'fr-FR': { name: 'French', nativeName: 'Français', dir: 'ltr' },
  'de': { name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  'zh-CN': { name: 'Chinese (Simplified)', nativeName: '简体中文', dir: 'ltr' },
  'ja': { name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  'ko': { name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  'ru': { name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  'pt-BR': { name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', dir: 'ltr' },
  'it': { name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  'nl': { name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' },
};

const SUPPORTED_LANGUAGES = [
  'af', 'id', 'ms', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'et',
  'en-IN', 'en-GB', 'en-US', 'es', 'es-CL', 'es-CO', 'es-ES', 'es-MX', 'es-VE', 'eu',
  'fil', 'fr-FR', 'fr-CA', 'ga', 'gl', 'ko', 'hr', 'xh', 'zu', 'is', 'it', 'sw',
  'lv', 'lt', 'hu', 'nl', 'nl-BE', 'ja', 'nb', 'nn', 'pl',
  'pt-BR', 'pt-PT', 'ro', 'ru', 'sq', 'sk', 'sl', 'fi', 'sv', 'th', 'vi', 'tr',
  'zh-CN', 'zh-TW', 'zh-HK', 'el', 'bg', 'mk', 'sr', 'uk', 'hy',
  'yi', 'he', 'ur', 'ar', 'fa', 'ne', 'mr', 'hi', 'bn', 'pa', 'gu', 'ta', 'te',
  'kn', 'ml', 'km'
];

const RTL_LANGUAGES = new Set(['ar', 'he', 'ur', 'fa', 'ps', 'syr', 'yi']);

let currentLanguage = localStorage?.getItem('i18nextLng') ||
  navigator?.language || 'en-US';
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
  const baseLng = lng?.split('-')?.[0];
  const meta = LANGUAGE_METADATA?.[lng] || LANGUAGE_METADATA?.[baseLng];
  const dir = meta?.dir || (RTL_LANGUAGES?.has(baseLng) ? 'rtl' : 'ltr');
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

const i18n = {
  language: currentLanguage,
  isInitialized: false,

  use: () => i18n,

  init: async () => {
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
i18n?.init();

export default i18n;