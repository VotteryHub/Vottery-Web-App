import { useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import perplexityCarouselIntelligenceService from '../../services/perplexityCarouselIntelligenceService';
import { TrendingUp, Target, BarChart3, Lightbulb, Globe, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function PerplexityCarouselIntelligenceDashboard() {
  const [loading, setLoading] = useState(false);
  const [benchmarking, setBenchmarking] = useState(null);
  const [marketTrends, setMarketTrends] = useState(null);
  const [activeTab, setActiveTab] = useState('benchmarking');

  const loadBenchmarking = async () => {
    setLoading(true);
    try {
      const { data: performanceData, error: perfError } = await perplexityCarouselIntelligenceService?.getCarouselPerformanceData('30d');
      
      if (perfError) {
        toast?.error(perfError?.message);
        return;
      }

      const { data: benchmarkData, error: benchError } = await perplexityCarouselIntelligenceService?.performCompetitiveBenchmarking(performanceData);
      
      if (benchError) {
        toast?.error(benchError?.message);
        return;
      }

      setBenchmarking(benchmarkData);
      toast?.success('Competitive benchmarking analysis completed');
    } catch (err) {
      toast?.error('Failed to load benchmarking data');
    } finally {
      setLoading(false);
    }
  };

  const loadMarketTrends = async () => {
    setLoading(true);
    try {
      const { data, error } = await perplexityCarouselIntelligenceService?.analyzeMarketTrends();
      
      if (error) {
        toast?.error(error?.message);
        return;
      }

      setMarketTrends(data);
      toast?.success('Market trend analysis completed');
    } catch (err) {
      toast?.error('Failed to load market trends');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Helmet>
        <title>Perplexity Carousel Intelligence | Vottery</title>
      </Helmet>
      <Toaster position="top-right" />
      <HeaderNavigation />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Perplexity Carousel Intelligence
              </h1>
              <p className="text-gray-600">
                Extended reasoning for competitive benchmarking and market trend analysis across carousel types
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadBenchmarking}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && activeTab === 'benchmarking' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Target className="w-5 h-5" />
                )}
                Run Benchmarking
              </button>
              <button
                onClick={loadMarketTrends}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && activeTab === 'trends' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
                Analyze Trends
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 border border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('benchmarking')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'benchmarking' ?'bg-blue-600 text-white' :'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Competitive Benchmarking
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'trends' ?'bg-blue-600 text-white' :'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Market Trends
            </button>
          </div>
        </div>

        {/* Competitive Benchmarking Tab */}
        {activeTab === 'benchmarking' && benchmarking && (
          <>
            {/* Industry Benchmarks */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Industry Benchmarks</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {benchmarking?.industryBenchmarks?.map((benchmark, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{benchmark?.carouselType}</h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        benchmark?.ranking?.includes('Top') ? 'bg-green-100 text-green-700' :
                        benchmark?.ranking?.includes('Above') ? 'bg-blue-100 text-blue-700' :
                        benchmark?.ranking?.includes('Average') ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {benchmark?.ranking}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Industry Average</div>
                        <div className="text-lg font-bold text-gray-900">{benchmark?.industryAvgEngagement}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Top Performer</div>
                        <div className="text-lg font-bold text-green-600">{benchmark?.topPerformerEngagement}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Your Performance</div>
                        <div className="text-lg font-bold text-blue-600">{benchmark?.yourPerformance}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Gap to Top</div>
                        <div className="text-lg font-bold text-red-600">{benchmark?.gap}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">Industry Best Practices</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benchmarking?.bestPractices?.map((practice, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500">{practice?.platform}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        practice?.applicability === 'High' ? 'bg-green-100 text-green-700' :
                        practice?.applicability === 'Medium'? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {practice?.applicability} Applicability
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{practice?.practice}</h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-xs text-blue-700 font-medium mb-1">Expected Impact</div>
                      <div className="text-sm text-blue-900">{practice?.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SWOT Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Competitive Positioning (SWOT)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {benchmarking?.competitivePositioning?.strengths?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-green-800">
                        <ArrowRight className="w-4 h-4 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {benchmarking?.competitivePositioning?.weaknesses?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-red-800">
                        <ArrowRight className="w-4 h-4 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                  <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {benchmarking?.competitivePositioning?.opportunities?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-blue-800">
                        <ArrowRight className="w-4 h-4 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                  <h3 className="font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Threats
                  </h3>
                  <ul className="space-y-2">
                    {benchmarking?.competitivePositioning?.threats?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-yellow-800">
                        <ArrowRight className="w-4 h-4 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Strategic Recommendations</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benchmarking?.recommendations?.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rec?.priority === 'High' ? 'bg-red-100 text-red-700' :
                        rec?.priority === 'Medium'? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {rec?.priority} Priority
                      </span>
                      <span className="text-xs text-gray-500">{rec?.timeframe}</span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{rec?.recommendation}</h3>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-xs text-green-700 font-medium mb-1">Expected Impact</div>
                      <div className="text-sm text-green-900">{rec?.expectedImpact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Market Trends Tab */}
        {activeTab === 'trends' && marketTrends && (
          <>
            {/* Current Trends */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Current Market Trends</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {marketTrends?.currentTrends?.map((trend, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{trend?.trend}</h3>
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                        {trend?.adoptionRate} Adoption
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{trend?.description}</p>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Platforms:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trend?.platforms?.map((platform, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-xs text-blue-700 font-medium mb-1">Impact</div>
                      <div className="text-sm text-blue-900">{trend?.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Patterns */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Engagement Patterns by Carousel Type</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketTrends?.engagementPatterns?.map((pattern, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{pattern?.carouselType}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Average Engagement</div>
                        <div className="text-2xl font-bold text-blue-600">{pattern?.avgEngagement}</div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 font-medium mb-1">Best Performing Content</div>
                        <div className="text-sm text-gray-900">{pattern?.bestPerformingContent}</div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 font-medium mb-1">User Preferences</div>
                        <div className="text-sm text-gray-900">{pattern?.userPreferences}</div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-600 font-medium mb-2">Platform Leaders</div>
                        <div className="flex flex-wrap gap-2">
                          {pattern?.platformLeaders?.map((leader, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {leader}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Future Predictions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Future Predictions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketTrends?.futurePredictions?.map((prediction, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500">{prediction?.timeframe}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        prediction?.confidence === 'High' ? 'bg-green-100 text-green-700' :
                        prediction?.confidence === 'Medium'? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {prediction?.confidence} Confidence
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{prediction?.prediction}</h3>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="text-xs text-purple-700 font-medium mb-1">Implications</div>
                      <div className="text-sm text-purple-900">{prediction?.implications}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {((activeTab === 'benchmarking' && !benchmarking) || (activeTab === 'trends' && !marketTrends)) && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Available</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'benchmarking' ?'Run competitive benchmarking to analyze carousel performance against industry standards' :'Analyze market trends to discover emerging carousel patterns and opportunities'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerplexityCarouselIntelligenceDashboard;