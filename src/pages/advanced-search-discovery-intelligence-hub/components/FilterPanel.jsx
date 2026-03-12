import React from 'react';
import { Calendar, TrendingUp, SortAsc } from 'lucide-react';

const FilterPanel = ({ filters, onFiltersChange }) => {
  const handleContentTypeToggle = (type) => {
    const newTypes = filters?.contentTypes?.includes(type)
      ? filters?.contentTypes?.filter(t => t !== type)
      : [...filters?.contentTypes, type];
    
    onFiltersChange({ ...filters, contentTypes: newTypes });
  };

  const handleDateRangeChange = (range) => {
    const ranges = {
      today: {
        start: new Date(new Date().setHours(0, 0, 0, 0))?.toISOString(),
        end: new Date()?.toISOString()
      },
      week: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString(),
        end: new Date()?.toISOString()
      },
      month: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString(),
        end: new Date()?.toISOString()
      },
      year: {
        start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)?.toISOString(),
        end: new Date()?.toISOString()
      }
    };

    onFiltersChange({ ...filters, dateRange: ranges?.[range] || null });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <SortAsc className="w-5 h-5 text-blue-600" />
        Filters
      </h3>
      {/* Content Types */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Content Types
        </label>
        <div className="space-y-2">
          {['posts', 'users', 'groups', 'elections']?.map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters?.contentTypes?.includes(type)}
                onChange={() => handleContentTypeToggle(type)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Date Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Date Range
        </label>
        <div className="space-y-2">
          {['today', 'week', 'month', 'year', 'all']?.map(range => (
            <button
              key={range}
              onClick={() => handleDateRangeChange(range === 'all' ? null : range)}
              className={`w-full px-3 py-2 text-left rounded-lg transition-all ${
                (range === 'all' && !filters?.dateRange) || 
                (filters?.dateRange && range !== 'all')
                  ? 'bg-blue-50 text-blue-700 font-medium' :'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {range === 'today' && 'Today'}
              {range === 'week' && 'Past Week'}
              {range === 'month' && 'Past Month'}
              {range === 'year' && 'Past Year'}
              {range === 'all' && 'All Time'}
            </button>
          ))}
        </div>
      </div>
      {/* Sort By */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Sort By
        </label>
        <select
          value={filters?.sortBy}
          onChange={(e) => onFiltersChange({ ...filters, sortBy: e?.target?.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="relevance">Relevance (AI)</option>
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="engagement">Highest Engagement</option>
        </select>
      </div>
      {/* Reset Filters */}
      <button
        onClick={() => onFiltersChange({
          contentTypes: ['posts', 'users', 'groups', 'elections'],
          dateRange: null,
          engagementLevel: null,
          geographicRegion: null,
          sortBy: 'relevance'
        })}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;