import React, { useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import platformLoggingService from '../../../services/platformLoggingService';

const AdvancedSearchEnginePanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('natural');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery?.trim()) return;

    setSearching(true);
    const { data, error } = await platformLoggingService?.getLogs({
      search: searchQuery,
      limit: 100
    });

    if (!error && data) {
      setResults(data);
    }
    setSearching(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-slate-900">Advanced Search Engine</h2>
      </div>
      {/* Search Interface */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setSearchType('natural')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === 'natural' ?'bg-purple-600 text-white' :'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Natural Language
          </button>
          <button
            onClick={() => setSearchType('regex')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === 'regex' ?'bg-purple-600 text-white' :'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Regex Pattern
          </button>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            onKeyPress={(e) => e?.key === 'Enter' && handleSearch()}
            placeholder={
              searchType === 'natural' ?'Search logs using natural language (e.g., "show me payment errors from yesterday")'
                : 'Enter regex pattern (e.g., "error.*payment.*failed")'
            }
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Search Results</h3>
          <span className="text-sm text-slate-600">{results?.length || 0} results</span>
        </div>

        {results?.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            {searching ? 'Searching...' : 'No results yet. Try searching for logs.'}
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {results?.map((result, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-slate-900">{result?.eventType}</span>
                    <p className="text-sm text-slate-600 mt-1">{result?.message}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(result?.createdAt)?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {result?.logLevel}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {result?.logCategory}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Anomaly Detection */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-slate-900">Automated Anomaly Detection</h4>
        </div>
        <p className="text-sm text-slate-600">
          AI-powered pattern recognition automatically identifies unusual log patterns, error spikes, and security anomalies 
          in real-time across all platform systems.
        </p>
      </div>
    </div>
  );
};

export default AdvancedSearchEnginePanel;