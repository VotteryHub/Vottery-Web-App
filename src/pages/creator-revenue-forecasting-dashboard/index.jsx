import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import creatorRevenueForecastingService from '../../services/creatorRevenueForecastingService';
import { TrendingUp, DollarSign, Target, AlertCircle, CheckCircle, ArrowUp, ArrowDown, Calendar, Globe } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function CreatorRevenueForecastingDashboard() {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [zoneOptimization, setZoneOptimization] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [creatorId, setCreatorId] = useState(null);

  useEffect(() => {
    // Get current user ID from auth context or session
    const userId = localStorage.getItem('userId') || 'demo-creator-id';
    setCreatorId(userId);
  }, []);

  const loadForecast = async () => {
    if (!creatorId) return;

    setLoading(true);
    try {
      const { data, error } = await creatorRevenueForecastingService?.generate30To90DayProjections(creatorId);
      
      if (error) {
        toast?.error(error?.message);
        return;
      }

      setForecast(data);
      setZoneOptimization(data?.zoneOptimization || []);
      toast?.success('Revenue forecast generated successfully');
    } catch (err) {
      toast?.error('Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  };

  const getProjectionData = () => {
    if (!forecast) return null;
    
    switch (selectedTimeframe) {
      case '30':
        return forecast?.projections?.day30;
      case '60':
        return forecast?.projections?.day60;
      case '90':
        return forecast?.projections?.day90;
      default:
        return forecast?.projections?.day30;
    }
  };

  const projectionData = getProjectionData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Helmet>
        <title>Creator Revenue Forecasting | Vottery</title>
      </Helmet>
      <Toaster position="top-right" />
      <HeaderNavigation />
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Creator Revenue Forecasting
              </h1>
              <p className="text-gray-600">
                OpenAI-powered 30-90 day carousel earnings projections with zone-specific payout optimization
              </p>
            </div>
            <button
              onClick={loadForecast}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Generate Forecast
                </>
              )}
            </button>
          </div>
        </div>

        {forecast && (
          <>
            {/* Timeframe Selector */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Projection Timeframe:</span>
                <div className="flex gap-2">
                  {['30', '60', '90']?.map(days => (
                    <button
                      key={days}
                      onClick={() => setSelectedTimeframe(days)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedTimeframe === days
                          ? 'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Projection Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8 mb-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedTimeframe}-Day Revenue Projection</h2>
                  <p className="text-blue-100">AI-powered earnings forecast with confidence intervals</p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-blue-200 text-sm mb-2">Projected Revenue</div>
                  <div className="text-4xl font-bold mb-2">
                    ${projectionData?.projected?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {projectionData?.confidence}% Confidence
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-blue-200 text-sm mb-2">Low Estimate</div>
                  <div className="text-3xl font-bold mb-2">
                    ${projectionData?.confidenceInterval?.low?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowDown className="w-4 h-4" />
                    Conservative Scenario
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-blue-200 text-sm mb-2">High Estimate</div>
                  <div className="text-3xl font-bold mb-2">
                    ${projectionData?.confidenceInterval?.high?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowUp className="w-4 h-4" />
                    Optimistic Scenario
                  </div>
                </div>
              </div>
            </div>

            {/* Zone-Specific Payout Optimization */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Zone-Specific Payout Optimization</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {zoneOptimization?.map((zone, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{zone?.zone}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        zone?.priority === 'High' ? 'bg-red-100 text-red-700' :
                        zone?.priority === 'Medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {zone?.priority} Priority
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current Payout</div>
                        <div className="text-lg font-bold text-gray-900">${zone?.currentPayout?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Optimized Payout</div>
                        <div className="text-lg font-bold text-green-600">${zone?.optimizedPayout?.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="text-xs text-green-700 font-medium mb-1">Expected Increase</div>
                      <div className="text-sm text-green-900">{zone?.expectedIncrease}</div>
                    </div>

                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Strategy:</span> {zone?.strategy}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth & Risk Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Growth Factors</h2>
                </div>
                <ul className="space-y-3">
                  {forecast?.growthFactors?.map((factor, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-bold text-gray-900">Risk Factors</h2>
                </div>
                <ul className="space-y-3">
                  {forecast?.riskFactors?.map((factor, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Revenue Maximization Recommendations</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forecast?.recommendations?.map((rec, index) => (
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

                    <h3 className="font-semibold text-gray-900 mb-2">{rec?.action}</h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-xs text-blue-700 font-medium mb-1">Expected Impact</div>
                      <div className="text-sm text-blue-900">{rec?.expectedImpact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!forecast && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Forecast Generated</h3>
            <p className="text-gray-600 mb-6">
              Click "Generate Forecast" to create AI-powered revenue projections with zone-specific optimization
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatorRevenueForecastingDashboard;