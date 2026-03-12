import React, { useState, useEffect } from 'react';
import { Globe, Languages, CheckCircle, Settings, FileText } from 'lucide-react';
import { localizationService } from '../../services/localizationService';
import i18n from '../../lib/i18n';

const useTranslation = () => ({ t: i18n?.t?.bind(i18n), i18n });

const GlobalLocalizationControlCenter = () => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [translationStatus, setTranslationStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  useEffect(() => {
    loadTranslationStatus();
  }, []);

  const loadTranslationStatus = async () => {
    setLoading(true);
    const result = await localizationService?.getTranslationStatus();
    if (result?.success) {
      setTranslationStatus(result?.translations);
    }
    setLoading(false);
  };

  const handleLanguageChange = async (languageCode) => {
    const result = await localizationService?.changeLanguage(languageCode);
    if (result?.success) {
      setSelectedLanguage(languageCode);
    }
  };

  // All 61 supported languages
  const languages = [
    { code: 'af', name: 'Afrikaans', native: 'Afrikaans', completion: 45 },
    { code: 'gn', name: 'Guaraní', native: 'Avañe\'ẽ', completion: 12 },
    { code: 'ay', name: 'Aymara', native: 'Aymar aru', completion: 8 },
    { code: 'az', name: 'Azeri', native: 'Azərbaycan', completion: 67 },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', completion: 89 },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', completion: 78 },
    { code: 'jv', name: 'Javanese', native: 'Basa Jawa', completion: 34 },
    { code: 'bs', name: 'Bosnian', native: 'Bosanski', completion: 56 },
    { code: 'ca', name: 'Catalan', native: 'Català', completion: 72 },
    { code: 'cs', name: 'Czech', native: 'Čeština', completion: 91 },
    { code: 'chr', name: 'Cherokee', native: 'ᏣᎳᎩ', completion: 5 },
    { code: 'cy', name: 'Welsh', native: 'Cymraeg', completion: 43 },
    { code: 'da', name: 'Danish', native: 'Dansk', completion: 88 },
    { code: 'se', name: 'Northern Sámi', native: 'Davvisámegiella', completion: 15 },
    { code: 'de', name: 'German', native: 'Deutsch', completion: 98 },
    { code: 'et', name: 'Estonian', native: 'Eesti', completion: 76 },
    { code: 'en-IN', name: 'English (India)', native: 'English (India)', completion: 100 },
    { code: 'en-PI', name: 'English (Pirate)', native: 'English (Pirate)', completion: 100 },
    { code: 'en-GB', name: 'English (UK)', native: 'English (UK)', completion: 100 },
    { code: 'en-US', name: 'English (US)', native: 'English (US)', completion: 100 },
    { code: 'es', name: 'Spanish', native: 'Español', completion: 97 },
    { code: 'es-CL', name: 'Spanish (Chile)', native: 'Español (Chile)', completion: 94 },
    { code: 'es-CO', name: 'Spanish (Colombia)', native: 'Español (Colombia)', completion: 93 },
    { code: 'es-ES', name: 'Spanish (Spain)', native: 'Español (España)', completion: 98 },
    { code: 'es-MX', name: 'Spanish (Mexico)', native: 'Español (México)', completion: 96 },
    { code: 'es-VE', name: 'Spanish (Venezuela)', native: 'Español (Venezuela)', completion: 92 },
    { code: 'eo', name: 'Esperanto', native: 'Esperanto', completion: 38 },
    { code: 'eu', name: 'Basque', native: 'Euskara', completion: 61 },
    { code: 'fil', name: 'Filipino', native: 'Filipino', completion: 82 },
    { code: 'fo', name: 'Faroese', native: 'Føroyskt', completion: 29 },
    { code: 'fr-FR', name: 'French (France)', native: 'Français', completion: 99 },
    { code: 'fr-CA', name: 'French (Canada)', native: 'Français (Canada)', completion: 95 },
    { code: 'fy', name: 'Frisian', native: 'Frysk', completion: 22 },
    { code: 'ga', name: 'Irish', native: 'Gaeilge', completion: 47 },
    { code: 'gl', name: 'Galician', native: 'Galego', completion: 68 },
    { code: 'ko', name: 'Korean', native: '한국어', completion: 94 },
    { code: 'hr', name: 'Croatian', native: 'Hrvatski', completion: 85 },
    { code: 'xh', name: 'Xhosa', native: 'isiXhosa', completion: 18 },
    { code: 'zu', name: 'Zulu', native: 'isiZulu', completion: 21 },
    { code: 'is', name: 'Icelandic', native: 'Íslenska', completion: 73 },
    { code: 'it', name: 'Italian', native: 'Italiano', completion: 97 },
    { code: 'ka', name: 'Georgian', native: 'ქართული', completion: 52 },
    { code: 'sw', name: 'Swahili', native: 'Kiswahili', completion: 64 },
    { code: 'tlh', name: 'Klingon', native: 'tlhIngan Hol', completion: 100 },
    { code: 'ku', name: 'Kurdish', native: 'Kurdî', completion: 31 },
    { code: 'lv', name: 'Latvian', native: 'Latviešu', completion: 79 },
    { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', completion: 81 },
    { code: 'li', name: 'Limburgish', native: 'Limburgs', completion: 11 },
    { code: 'la', name: 'Latin', native: 'Latina', completion: 25 },
    { code: 'hu', name: 'Hungarian', native: 'Magyar', completion: 87 },
    { code: 'mg', name: 'Malagasy', native: 'Malagasy', completion: 19 },
    { code: 'mt', name: 'Maltese', native: 'Malti', completion: 42 },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', completion: 96 },
    { code: 'nl-BE', name: 'Dutch (België)', native: 'Nederlands (België)', completion: 93 },
    { code: 'ja', name: 'Japanese', native: '日本語', completion: 98 },
    { code: 'nb', name: 'Norwegian (bokmal)', native: 'Norsk (bokmål)', completion: 90 },
    { code: 'nn', name: 'Norwegian (nynorsk)', native: 'Norsk (nynorsk)', completion: 86 },
    { code: 'uz', name: 'Uzbek', native: 'O\'zbek', completion: 36 },
    { code: 'pl', name: 'Polish', native: 'Polski', completion: 95 },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', native: 'Português (Brasil)', completion: 98 },
    { code: 'pt-PT', name: 'Portuguese (Portugal)', native: 'Português (Portugal)', completion: 96 },
    { code: 'qu', name: 'Quechua', native: 'Qhichwa', completion: 7 },
    { code: 'ro', name: 'Romanian', native: 'Română', completion: 84 },
    { code: 'rm', name: 'Romansh', native: 'Rumantsch', completion: 14 },
    { code: 'ru', name: 'Russian', native: 'Русский', completion: 99 },
    { code: 'sq', name: 'Albanian', native: 'Shqip', completion: 58 },
    { code: 'sk', name: 'Slovak', native: 'Slovenčina', completion: 83 },
    { code: 'sl', name: 'Slovenian', native: 'Slovenščina', completion: 80 },
    { code: 'so', name: 'Somali', native: 'Soomaali', completion: 27 },
    { code: 'fi', name: 'Finnish', native: 'Suomi', completion: 92 },
    { code: 'sv', name: 'Swedish', native: 'Svenska', completion: 94 },
    { code: 'th', name: 'Thai', native: 'ไทย', completion: 88 },
    { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', completion: 91 },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', completion: 93 },
    { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文', completion: 99 },
    { code: 'zh-TW', name: 'Chinese (Traditional - Taiwan)', native: '繁體中文 (台灣)', completion: 97 },
    { code: 'zh-HK', name: 'Chinese (Traditional - Hong Kong)', native: '繁體中文 (香港)', completion: 96 },
    { code: 'el', name: 'Greek', native: 'Ελληνικά', completion: 89 },
    { code: 'grc', name: 'Classical Greek', native: 'Ἑλληνική', completion: 16 },
    { code: 'be', name: 'Belarusian', native: 'Беларуская', completion: 49 },
    { code: 'bg', name: 'Bulgarian', native: 'Български', completion: 86 },
    { code: 'kk', name: 'Kazakh', native: 'Қазақша', completion: 41 },
    { code: 'mk', name: 'Macedonian', native: 'Македонски', completion: 54 },
    { code: 'mn', name: 'Mongolian', native: 'Монгол', completion: 33 },
    { code: 'sr', name: 'Serbian', native: 'Српски', completion: 77 },
    { code: 'tt', name: 'Tatar', native: 'Татарча', completion: 23 },
    { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ', completion: 28 },
    { code: 'uk', name: 'Ukrainian', native: 'Українська', completion: 90 },
    { code: 'hy', name: 'Armenian', native: 'Հայերեն', completion: 55 },
    { code: 'yi', name: 'Yiddish', native: 'ייִדיש', completion: 37 },
    { code: 'he', name: 'Hebrew', native: 'עברית', completion: 92 },
    { code: 'ur', name: 'Urdu', native: 'اردو', completion: 74 },
    { code: 'ar', name: 'Arabic', native: 'العربية', completion: 95 },
    { code: 'ps', name: 'Pashto', native: 'پښتو', completion: 26 },
    { code: 'fa', name: 'Persian', native: 'فارسی', completion: 87 },
    { code: 'syr', name: 'Syriac', native: 'ܣܘܪܝܝܐ', completion: 9 },
    { code: 'ne', name: 'Nepali', native: 'नेपाली', completion: 62 },
    { code: 'mr', name: 'Marathi', native: 'मराठी', completion: 69 },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', completion: 13 },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', completion: 93 },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', completion: 85 },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', completion: 71 },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', completion: 66 },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', completion: 81 },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', completion: 78 },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', completion: 73 },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', completion: 76 },
    { code: 'km', name: 'Khmer', native: 'ខ្មែរ', completion: 44 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global Localization Control Center</h1>
              <p className="text-gray-600 mt-1">Comprehensive multi-language support across 61 languages with advanced i18n system</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">61</div>
              <div className="text-sm text-gray-600 mt-1">Supported Languages</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">42</div>
              <div className="text-sm text-gray-600 mt-1">Fully Translated</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="text-3xl font-bold text-yellow-600">15</div>
              <div className="text-sm text-gray-600 mt-1">In Progress</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600 mt-1">RTL Languages</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Globe },
              { id: 'languages', label: 'Language Management', icon: Languages },
              { id: 'translation', label: 'Translation Workflow', icon: FileText },
              { id: 'regional', label: 'Regional Customization', icon: Settings },
            ]?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab?.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <DashboardPanel languages={languages} />
        )}

        {/* Language Management Tab */}
        {activeTab === 'languages' && (
          <LanguageManagementPanel 
            languages={languages} 
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {/* Translation Workflow Tab */}
        {activeTab === 'translation' && (
          <TranslationWorkflowPanel />
        )}

        {/* Regional Customization Tab */}
        {activeTab === 'regional' && (
          <RegionalCustomizationPanel />
        )}
      </div>
    </div>
  );
};

// Dashboard Panel Component
const DashboardPanel = ({ languages }) => {
  const completionRanges = [
    { label: '90-100%', count: languages?.filter(l => l?.completion >= 90)?.length, color: 'bg-green-500' },
    { label: '70-89%', count: languages?.filter(l => l?.completion >= 70 && l?.completion < 90)?.length, color: 'bg-blue-500' },
    { label: '50-69%', count: languages?.filter(l => l?.completion >= 50 && l?.completion < 70)?.length, color: 'bg-yellow-500' },
    { label: 'Below 50%', count: languages?.filter(l => l?.completion < 50)?.length, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Translation Completion Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Translation Completion Status</h3>
        <div className="grid grid-cols-4 gap-4">
          {completionRanges?.map((range, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className={`w-12 h-12 ${range?.color} rounded-lg mb-3 flex items-center justify-center text-white font-bold text-xl`}>
                {range?.count}
              </div>
              <div className="text-sm font-semibold text-gray-900">{range?.label}</div>
              <div className="text-xs text-gray-600 mt-1">Languages</div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Translation Activity</h3>
        <div className="space-y-3">
          {[
            { lang: 'Spanish (Spain)', action: 'Updated 45 strings', time: '2 hours ago', user: 'Maria Garcia' },
            { lang: 'Japanese', action: 'Completed election module', time: '5 hours ago', user: 'Yuki Tanaka' },
            { lang: 'Arabic', action: 'RTL layout fixes', time: '1 day ago', user: 'Ahmed Hassan' },
            { lang: 'French (France)', action: 'Cultural adaptation review', time: '2 days ago', user: 'Sophie Martin' },
          ]?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {activity?.user?.split(' ')?.map(n => n?.[0])?.join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{activity?.lang}</div>
                  <div className="text-sm text-gray-600">{activity?.action} by {activity?.user}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{activity?.time}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Cultural Context Indicators */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Cultural Context Indicators</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { region: 'Middle East', languages: 6, rtl: true, status: 'Active' },
            { region: 'East Asia', languages: 5, rtl: false, status: 'Active' },
            { region: 'South Asia', languages: 9, rtl: false, status: 'Active' },
            { region: 'Europe', languages: 28, rtl: false, status: 'Active' },
            { region: 'Americas', languages: 10, rtl: false, status: 'Active' },
            { region: 'Africa', languages: 3, rtl: false, status: 'Expanding' },
          ]?.map((region, index) => (
            <div key={index} className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{region?.region}</span>
                {region?.rtl && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">RTL</span>}
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{region?.languages}</div>
              <div className="text-xs text-gray-600">Languages • {region?.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Language Management Panel Component
const LanguageManagementPanel = ({ languages, selectedLanguage, onLanguageChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompletion, setFilterCompletion] = useState('all');

  const filteredLanguages = languages?.filter(lang => {
    const matchesSearch = lang?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         lang?.native?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterCompletion === 'all' ||
                         (filterCompletion === 'complete' && lang?.completion >= 90) ||
                         (filterCompletion === 'incomplete' && lang?.completion < 90);
    return matchesSearch && matchesFilter;
  });

  const rtlLanguages = ['ar', 'he', 'ur', 'fa', 'ps', 'syr', 'yi'];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterCompletion}
            onChange={(e) => setFilterCompletion(e?.target?.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Languages</option>
            <option value="complete">Complete (≥90%)</option>
            <option value="incomplete">Incomplete (&lt;90%)</option>
          </select>
        </div>
      </div>
      {/* Language List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">All Languages ({filteredLanguages?.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
          {filteredLanguages?.map((lang) => (
            <div
              key={lang?.code}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedLanguage === lang?.code
                  ? 'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onLanguageChange(lang?.code)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{lang?.name}</div>
                  <div className="text-sm text-gray-600">{lang?.native}</div>
                </div>
                {rtlLanguages?.includes(lang?.code) && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">RTL</span>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Translation Progress</span>
                  <span className="font-semibold">{lang?.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      lang?.completion >= 90 ? 'bg-green-500' :
                      lang?.completion >= 70 ? 'bg-blue-500' :
                      lang?.completion >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${lang?.completion}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Translation Workflow Panel Component
const TranslationWorkflowPanel = () => {
  return (
    <div className="space-y-6">
      {/* Automated Translation Integration */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Translation Integration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
              <div>
                <div className="font-semibold text-gray-900">OpenAI GPT-4</div>
                <div className="text-xs text-gray-600">Context-aware translation</div>
              </div>
            </div>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Configure Integration
            </button>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">TM</div>
              <div>
                <div className="font-semibold text-gray-900">Translation Memory</div>
                <div className="text-xs text-gray-600">Reuse previous translations</div>
              </div>
            </div>
            <button className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
              View Memory Bank
            </button>
          </div>
        </div>
      </div>
      {/* Human Review Queue */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Human Review Queue</h3>
        <div className="space-y-3">
          {[
            { key: 'election.create.title', source: 'Create Election', target: 'Crear Elección', lang: 'Spanish', status: 'pending' },
            { key: 'voting.cast.confirm', source: 'Confirm Vote', target: '投票を確認', lang: 'Japanese', status: 'pending' },
            { key: 'results.winner.announce', source: 'Winner Announced', target: 'الفائز المعلن', lang: 'Arabic', status: 'approved' },
          ]?.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item?.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item?.status === 'approved' ? 'Approved' : 'Pending Review'}
                  </span>
                  <span className="text-sm font-medium text-gray-600">{item?.lang}</span>
                </div>
                {item?.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-700">
                <div className="mb-1"><span className="font-semibold">Source:</span> {item?.source}</div>
                <div><span className="font-semibold">Translation:</span> {item?.target}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Cultural Adaptation Guidelines */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Cultural Adaptation Guidelines</h3>
        <div className="space-y-3">
          {[
            { region: 'Middle East', guideline: 'Use formal language, avoid left-hand imagery, respect religious sensitivities' },
            { region: 'East Asia', guideline: 'Maintain hierarchical respect, use appropriate honorifics, consider collectivist values' },
            { region: 'Latin America', guideline: 'Warm and personal tone, family-oriented messaging, regional dialect variations' },
          ]?.map((item, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="font-semibold text-gray-900 mb-1">{item?.region}</div>
              <div className="text-sm text-gray-700">{item?.guideline}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Regional Customization Panel Component
const RegionalCustomizationPanel = () => {
  return (
    <div className="space-y-6">
      {/* Country-Specific Legal Requirements */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Country-Specific Legal Requirements</h3>
        <div className="space-y-3">
          {[
            { country: 'European Union', flag: '🇪🇺', requirements: ['GDPR compliance', 'Cookie consent', 'Right to be forgotten'] },
            { country: 'United States', flag: '🇺🇸', requirements: ['CCPA compliance', 'ADA accessibility', 'State-specific regulations'] },
            { country: 'China', flag: '🇨🇳', requirements: ['ICP license', 'Data localization', 'Content censorship compliance'] },
          ]?.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item?.flag}</span>
                <span className="font-semibold text-gray-900">{item?.country}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item?.requirements?.map((req, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Cultural Voting Preferences */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Cultural Voting Preferences</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { region: 'Western Countries', preference: 'Individual choice emphasis', icon: '👤' },
            { region: 'Asian Countries', preference: 'Community consensus focus', icon: '👥' },
            { region: 'Middle Eastern Countries', preference: 'Traditional values respect', icon: '🕌' },
            { region: 'Latin American Countries', preference: 'Social engagement priority', icon: '🎉' },
          ]?.map((item, index) => (
            <div key={index} className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <div className="text-3xl mb-2">{item?.icon}</div>
              <div className="font-semibold text-gray-900 mb-1">{item?.region}</div>
              <div className="text-sm text-gray-600">{item?.preference}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Localized Payment Methods */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Localized Payment Methods</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { region: 'Europe', methods: ['SEPA', 'iDEAL', 'Sofort'] },
            { region: 'Asia', methods: ['Alipay', 'WeChat Pay', 'PayPay'] },
            { region: 'Latin America', methods: ['PIX', 'Mercado Pago', 'OXXO'] },
            { region: 'Middle East', methods: ['Fawry', 'STC Pay', 'Sadad'] },
            { region: 'Africa', methods: ['M-Pesa', 'Flutterwave', 'Paystack'] },
            { region: 'North America', methods: ['ACH', 'Venmo', 'Cash App'] },
          ]?.map((item, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="font-semibold text-gray-900 mb-2">{item?.region}</div>
              <div className="space-y-1">
                {item?.methods?.map((method, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {method}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalLocalizationControlCenter;