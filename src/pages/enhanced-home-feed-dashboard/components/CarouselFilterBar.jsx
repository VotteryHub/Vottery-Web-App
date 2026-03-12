import React, { useState, useEffect } from 'react';
import { Filter, Star, Clock, Flame } from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';


const CATEGORIES = [
  { id: 'all', label: 'All', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  { id: 'politics', label: 'Politics', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'technology', label: 'Technology', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'sports', label: 'Sports', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { id: 'entertainment', label: 'Entertainment', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  { id: 'business', label: 'Business', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'social', label: 'Social Issues', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
];

const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'newest', label: 'Newest', icon: Clock },
  { id: 'top', label: 'Top Rated', icon: Star },
];

const CarouselFilterBar = ({ carouselType, onFilterChange, className = '' }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTrending, setShowTrending] = useState(false);
  const [sortBy, setSortBy] = useState('trending');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSavedPreferences();
  }, [user?.id]);

  const loadSavedPreferences = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        ?.from('user_preferences')
        ?.select('preferences')
        ?.eq('user_id', user?.id)
        ?.eq('preference_type', `carousel_filter_${carouselType}`)
        ?.single();

      if (data?.preferences) {
        const prefs = data?.preferences;
        setSelectedCategory(prefs?.category || 'all');
        setShowTrending(prefs?.showTrending || false);
        setSortBy(prefs?.sortBy || 'trending');
        onFilterChange?.({ category: prefs?.category || 'all', showTrending: prefs?.showTrending || false, sortBy: prefs?.sortBy || 'trending' });
      }
    } catch (err) {
      // Preferences not found, use defaults
    }
  };

  const savePreferences = async (newPrefs) => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await supabase
        ?.from('user_preferences')
        ?.upsert({
          user_id: user?.id,
          preference_type: `carousel_filter_${carouselType}`,
          preferences: newPrefs,
          updated_at: new Date()?.toISOString()
        }, { onConflict: 'user_id,preference_type' });
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const newPrefs = { category: catId, showTrending, sortBy };
    onFilterChange?.(newPrefs);
    savePreferences(newPrefs);
  };

  const handleTrendingToggle = () => {
    const newVal = !showTrending;
    setShowTrending(newVal);
    const newPrefs = { category: selectedCategory, showTrending: newVal, sortBy };
    onFilterChange?.(newPrefs);
    savePreferences(newPrefs);
  };

  const handleSortChange = (sortId) => {
    setSortBy(sortId);
    const newPrefs = { category: selectedCategory, showTrending, sortBy: sortId };
    onFilterChange?.(newPrefs);
    savePreferences(newPrefs);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 mr-1">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Filter:</span>
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {CATEGORIES?.map(cat => (
            <button
              key={cat?.id}
              onClick={() => handleCategoryChange(cat?.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat?.id
                  ? `${cat?.color} ring-2 ring-offset-1 ring-blue-400`
                  : `${cat?.color} opacity-70 hover:opacity-100`
              }`}
            >
              {cat?.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-600" />

        {/* Trending toggle */}
        <button
          onClick={handleTrendingToggle}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showTrending
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 ring-2 ring-orange-400' :'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-orange-50'
          }`}
        >
          <Flame className="w-3 h-3" />
          Trending
        </button>

        {/* Sort options */}
        <div className="flex items-center gap-1">
          {SORT_OPTIONS?.map(opt => {
            const Icon = opt?.icon;
            return (
              <button
                key={opt?.id}
                onClick={() => handleSortChange(opt?.id)}
                title={opt?.label}
                className={`p-1.5 rounded-lg transition-colors ${
                  sortBy === opt?.id
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {saving && <span className="text-xs text-gray-400">Saving...</span>}
      </div>
    </div>
  );
};

export default CarouselFilterBar;
