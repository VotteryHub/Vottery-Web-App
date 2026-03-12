import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Save, X, Loader2, Sparkles } from 'lucide-react';
import AdvancedSearchService from '../../services/advancedSearchService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import SearchResultsPanel from './components/SearchResultsPanel';
import FilterPanel from './components/FilterPanel';
import TrendingSearchesPanel from './components/TrendingSearchesPanel';
import SavedSearchesPanel from './components/SavedSearchesPanel';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Search className="w-10 h-10 text-blue-600" />
              Advanced Search & Discovery
            </h1>
            <p className="text-gray-600 mt-2">
              Unified search across posts, users, groups, and elections with AI-assisted ranking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                showFilters
                  ? 'bg-blue-600 text-white' :'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search posts, users, groups, elections..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
            {user && searchQuery && (
              <button
                onClick={handleSaveSearch}
                className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions */}
          {autocompleteSuggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
              {autocompleteSuggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setAutocompleteSuggestions([]);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-all flex items-center gap-3"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start Your Search
                </h3>
                <p className="text-gray-600">
                  Enter a search query to discover posts, users, groups, and elections
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchDiscoveryIntelligenceHub;