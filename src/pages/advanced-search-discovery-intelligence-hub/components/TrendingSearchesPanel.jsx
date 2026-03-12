import React from 'react';
import { TrendingUp, Search } from 'lucide-react';

const TrendingSearchesPanel = ({ trendingSearches, onSelectSearch }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        Trending Searches
      </h3>
      {trendingSearches?.length === 0 ? (
        <p className="text-gray-500 text-sm">No trending searches yet</p>
      ) : (
        <div className="space-y-2">
          {trendingSearches?.map((search, index) => (
            <button
              key={index}
              onClick={() => onSelectSearch(search?.query)}
              className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm font-medium">{index + 1}</span>
                <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                <span className="text-gray-700 group-hover:text-blue-600">{search?.query}</span>
              </div>
              <span className="text-xs text-gray-400">{search?.search_count} searches</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingSearchesPanel;