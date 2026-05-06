import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Save, X, Loader2, Sparkles } from 'lucide-react';
import AdvancedSearchService from '../../services/advancedSearchService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import SearchResultsPanel from './components/SearchResultsPanel';
import FilterPanel from './components/FilterPanel';
import TrendingSearchesPanel from './components/TrendingSearchesPanel';
import SavedSearchesPanel from './components/SavedSearchesPanel';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';

const AdvancedSearchDiscoveryIntelligenceHub = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    contentTypes: ['posts', 'users', 'groups', 'elections'],
    dateRange: null,
    engagementLevel: null,
    geographicRegion: null,
    sortBy: 'relevance'
  });
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Load trending searches and saved searches
  useEffect(() => {
    loadTrendingSearches();
    if (user) {
      loadSavedSearches();
    }
  }, [user]);

  const loadTrendingSearches = async () => {
    try {
      const trending = await AdvancedSearchService?.getTrendingSearches(10);
      setTrendingSearches(trending);
    } catch (error) {
      console.error('Error loading trending searches:', error);
    }
  };

  const loadSavedSearches = async () => {
    try {
      const saved = await AdvancedSearchService?.getSavedSearches(user?.id);
      setSavedSearches(saved);
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  // Debounced autocomplete
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery?.length >= 2) {
        const suggestions = await AdvancedSearchService?.getAutocompleteSuggestions(searchQuery);
        setAutocompleteSuggestions(suggestions);
      } else {
        setAutocompleteSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery?.trim()) {
      toast?.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const results = await AdvancedSearchService?.unifiedSearch(searchQuery, filters);
      setSearchResults(results);

      // Track search
      if (user) {
        await AdvancedSearchService?.trackSearch(searchQuery, user?.id, results?.totalResults);
      }

      toast?.success(`Found ${results?.totalResults} results in ${results?.searchTime?.toFixed(0)}ms`);
    } catch (error) {
      console.error('Search error:', error);
      toast?.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!user) {
      toast?.error('Please sign in to save searches');
      return;
    }

    try {
      await AdvancedSearchService?.saveSearch(user?.id, searchQuery, filters);
      toast?.success('Search saved successfully');
      loadSavedSearches();
    } catch (error) {
      console.error('Save search error:', error);
      toast?.error('Failed to save search');
    }
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch?.query);
    setFilters(savedSearch?.filters);
    handleSearch();
  };

  const handleDeleteSavedSearch = async (searchId) => {
    try {
      await AdvancedSearchService?.deleteSavedSearch(searchId);
      toast?.success('Search deleted');
      loadSavedSearches();
    } catch (error) {
      console.error('Delete search error:', error);
      toast?.error('Failed to delete search');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <GeneralPageLayout title="Search & Discovery" showSidebar={true}>
      <div className="w-full py-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Search className="w-7 h-7 text-white" />
                </div>
                Search & Discovery
              </h1>
              <p className="text-base md:text-lg text-slate-400 font-medium">
                Unified search across posts, users, groups, and elections
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 py-3 rounded-2xl flex items-center gap-2 transition-all text-xs font-black uppercase tracking-widest ${
                  showFilters
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search elections, users, posts..."
                  className="w-full pl-14 pr-12 py-5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="flex-1 sm:flex-none px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                >
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  <span className={isSearching ? "" : "hidden sm:inline"}>Search</span>
                </button>
                {user && searchQuery && (
                  <button
                    onClick={handleSaveSearch}
                    className="px-5 py-4 bg-white/5 border border-white/10 text-slate-300 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    title="Save Search"
                  >
                    <Save className="w-5 h-5" />
                    <span className="hidden md:inline text-xs font-black uppercase tracking-widest">Save</span>
                  </button>
                )}
              </div>
            </div>

            {/* Autocomplete Suggestions */}
            {autocompleteSuggestions?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                {autocompleteSuggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setAutocompleteSuggestions([]);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-white/5 transition-all flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <Search className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300 text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Searches */}
            <TrendingSearchesPanel
              trendingSearches={trendingSearches}
              onSelectSearch={(query) => {
                setSearchQuery(query);
                handleSearch();
              }}
            />

            {/* Saved Searches */}
            {user && (
              <SavedSearchesPanel
                savedSearches={savedSearches}
                onLoadSearch={handleLoadSavedSearch}
                onDeleteSearch={handleDeleteSavedSearch}
              />
            )}

            {/* Filters */}
            {showFilters && (
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {searchResults ? (
              <SearchResultsPanel
                results={searchResults}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            ) : (
              <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-16 text-center shadow-2xl">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                  Start Your Search
                </h3>
                <p className="text-slate-400 font-medium">
                  Enter a search query to discover posts, users, groups, and elections
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default AdvancedSearchDiscoveryIntelligenceHub;