import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { unifiedIncidentResponseService } from '../../../services/unifiedIncidentResponseService';

const IncidentInvestigationTools = ({ incidents }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [investigationMode, setInvestigationMode] = useState('overview');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleAnalyzeWithPerplexity = async (incident) => {
    try {
      setAnalyzing(true);
      const result = await unifiedIncidentResponseService?.analyzeIncidentWithPerplexity(incident);
      setAnalysisResults({
        provider: 'perplexity',
        ...result
      });
    } catch (error) {
      console.error('Error analyzing with Perplexity:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeWithClaude = async (incident) => {
    try {
      setAnalyzing(true);
      const result = await unifiedIncidentResponseService?.analyzeIncidentWithClaude(incident);
      setAnalysisResults({
        provider: 'claude',
        ...result
      });
    } catch (error) {
      console.error('Error analyzing with Claude:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const activeIncidents = incidents?.filter(i => i?.status === 'active') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI-Powered Incident Investigation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Deep-dive analysis using Perplexity threat intelligence and Claude reasoning
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={investigationMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInvestigationMode('overview')}
            >
              Overview
            </Button>
            <Button
              variant={investigationMode === 'analysis' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInvestigationMode('analysis')}
            >
              AI Analysis
            </Button>
          </div>
        </div>
      </div>

      {investigationMode === 'overview' ? (
        <>
          {/* Investigation Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Perplexity Threat Intelligence */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Icon name="Search" size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Perplexity Threat Intelligence</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Real-time threat analysis and pattern recognition</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-green-500" />
                  Attack vector identification
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-green-500" />
                  Threat pattern correlation
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-green-500" />
                  Evidence collection priorities
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-green-500" />
                  Automated response recommendations
                </li>
              </ul>
            </div>

            {/* Claude Decision Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Icon name="Brain" size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Claude Decision Analysis</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Nuanced reasoning and policy compliance</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-green-500" />
                  Decision confidence scoring
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-green-500" />
                  Compliance impact evaluation
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-green-500" />
                  Stakeholder notification requirements
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={14} className="text-green-500" />
                  Bias detection and fairness
                </li>
              </ul>
            </div>
          </div>

          {/* Active Incidents for Investigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Active Incidents Requiring Investigation
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {activeIncidents?.length === 0 ? (
                <div className="p-8 text-center">
                  <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No active incidents requiring investigation.</p>
                </div>
              ) : (
                activeIncidents?.map((incident) => (
                  <div key={incident?.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident?.threatLevel)}`}>
                            {incident?.threatLevel?.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(incident?.detectedAt)?.toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {incident?.incidentType?.replace(/_/g, ' ')?.toUpperCase()}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {incident?.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedIncident(incident);
                            handleAnalyzeWithPerplexity(incident);
                            setInvestigationMode('analysis');
                          }}
                          className="flex items-center gap-2"
                        >
                          <Icon name="Search" size={16} />
                          Perplexity
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedIncident(incident);
                            handleAnalyzeWithClaude(incident);
                            setInvestigationMode('analysis');
                          }}
                          className="flex items-center gap-2"
                        >
                          <Icon name="Brain" size={16} />
                          Claude
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* AI Analysis Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  AI Investigation Results
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInvestigationMode('overview');
                    setSelectedIncident(null);
                    setAnalysisResults(null);
                  }}
                >
                  Back to Overview
                </Button>
              </div>
            </div>
            <div className="p-6">
              {analyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Icon name="Loader" size={48} className="animate-spin text-primary mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Analyzing incident with AI...</p>
                </div>
              ) : analysisResults ? (
                <div className="space-y-6">
                  {/* Provider Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      analysisResults?.provider === 'perplexity' ?'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {analysisResults?.provider === 'perplexity' ? 'Perplexity Analysis' : 'Claude Analysis'}
                    </span>
                  </div>

                  {/* Analysis Content */}
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">
                        {analysisResults?.analysis}
                      </pre>
                    </div>
                  </div>

                  {/* Search Results (Perplexity only) */}
                  {analysisResults?.searchResults?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Related Threat Intelligence</h4>
                      <div className="space-y-2">
                        {analysisResults?.searchResults?.map((result, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{result}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage Stats */}
                  {analysisResults?.usage && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Tokens used: {analysisResults?.usage?.total_tokens || analysisResults?.usage?.input_tokens + analysisResults?.usage?.output_tokens}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">Select an incident to begin AI-powered investigation</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentInvestigationTools;