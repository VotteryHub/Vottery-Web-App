import React from 'react';
import { Save, Trash2, Clock } from 'lucide-react';

const SavedSearchesPanel = ({ savedSearches, onLoadSearch, onDeleteSearch }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Save className="w-5 h-5 text-blue-600" />
        Saved Searches
      </h3>
      {savedSearches?.length === 0 ? (
        <p className="text-gray-500 text-sm">No saved searches yet</p>
      ) : (
        <div className="space-y-2">
          {savedSearches?.map((search) => (
            <div
              key={search?.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start justify-between">
                <button
                  onClick={() => onLoadSearch(search)}
                  className="flex-1 text-left"
                >
                  <p className="text-gray-900 font-medium group-hover:text-blue-600">
                    {search?.query}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(search.created_at)?.toLocaleDateString()}
                  </div>
                </button>
                <button
                  onClick={() => onDeleteSearch(search?.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSearchesPanel;