import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { crossDomainIntelligenceService } from '../../../services/crossDomainIntelligenceService';

const CustomQueryPanel = () => {
  const [query, setQuery] = useState('');
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const domains = [
    { id: 'financial', label: 'Financial' },
    { id: 'user_behavior', label: 'User Behavior' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'incidents', label: 'Incidents' },
  ];

  const executeQuery = async () => {
    if (!query?.trim() || selectedDomains?.length === 0) return;
    setLoading(true);
    try {
      const data = await crossDomainIntelligenceService?.consolidateIntelligence(selectedDomains);
      setResults(data);
    } catch (error) {
      console.error('Query execution error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Query Builder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Search" size={20} />
          Custom Intelligence Query
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Query Description
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e?.target?.value)}
              placeholder="Describe the intelligence you need (e.g., 'Analyze fraud patterns in Zone 3 over the last 30 days')..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Domains
            </label>
            <div className="flex flex-wrap gap-2">
              {domains?.map((domain) => (
                <button
                  key={domain?.id}
                  onClick={() => {
                    if (selectedDomains?.includes(domain?.id)) {
                      setSelectedDomains(selectedDomains?.filter(d => d !== domain?.id));
                    } else {
                      setSelectedDomains([...selectedDomains, domain?.id]);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedDomains?.includes(domain?.id)
                      ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {domain?.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={executeQuery}
            disabled={loading || !query?.trim() || selectedDomains?.length === 0}
            className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Executing Query...
              </>
            ) : (
              <>
                <Icon name="Play" size={18} />
                Execute Query
              </>
            )}
          </button>
        </div>
      </div>

      {/* Query Results */}
      {results && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Query Results</h3>
          <div className="space-y-4">
            {results?.perplexityInsights && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  Perplexity Analysis
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {results?.perplexityInsights?.analysis}
                </p>
              </div>
            )}
            {results?.claudeInsights && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Claude Analysis
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {results?.claudeInsights?.analysis}
                </p>
              </div>
            )}
            {results?.openaiInsights && (
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
                  OpenAI Analysis
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {results?.openaiInsights?.analysis}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomQueryPanel;