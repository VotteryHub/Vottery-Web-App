import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import creatorRevenueForecastingService from '../../services/creatorRevenueForecastingService';
import { supabase } from '../../lib/supabase';
import { TrendingUp, DollarSign, Target, AlertCircle, CheckCircle, ArrowUp, ArrowDown, Calendar, Globe } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';

function CreatorRevenueForecastingDashboard() {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [zoneOptimization, setZoneOptimization] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [creatorId, setCreatorId] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const resolveUser = async () => {
      const { data } = await supabase?.auth?.getUser();
      setCreatorId(data?.user?.id || null);
      setAuthResolved(true);
    };
    resolveUser();
  }, []);

  const loadForecast = async () => {
    if (!creatorId) {
      toast?.error('Sign in required to generate creator forecast.');
      return;
    }

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
    <GeneralPageLayout 
      title="Creator Revenue Forecasting"
      showSidebar={true}
    >
      <div className="w-full py-0">
        <Toaster position="top-right" />
        {/* Header Action Bar */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 mb-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Revenue Strategy</h1>
            <p className="text-slate-400 font-medium text-sm">
              AI-powered 30-90 day carousel earnings projections with zone-specific payout optimization
            </p>
          </div>
          <button
            onClick={loadForecast}
            disabled={loading || !creatorId}
            className="px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Analyzing Market...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Initialize Projection
              </>
            )}
          </button>
        </div>

        {forecast && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Timeframe Selector */}
            <div className="flex gap-2 bg-black/20 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 mb-8 w-fit">
              {['30', '60', '90']?.map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedTimeframe(days)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    selectedTimeframe === days
                      ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/20'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {days} Day Outlook
                </button>
              ))}
            </div>

            {/* Revenue Projection Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-primary rounded-3xl shadow-2xl p-10 mb-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <TrendingUp size={160} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white/70 mb-2">{selectedTimeframe}-Day Projected Revenue</h2>
                    <p className="text-white/60 text-xs font-medium">Confidence Interval: {projectionData?.confidence}%</p>
                  </div>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">Primary Forecast</div>
                    <div className="text-4xl font-black tracking-tight mb-3">
                      ${projectionData?.projected?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-300">
                      <CheckCircle className="w-3 h-3" />
                      Optimized Path
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">Lower Bound</div>
                    <div className="text-3xl font-black tracking-tight mb-3">
                      ${projectionData?.confidenceInterval?.low?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-200">
                      <ArrowDown className="w-3 h-3" />
                      Risk Adjusted
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">Upper Bound</div>
                    <div className="text-3xl font-black tracking-tight mb-3">
                      ${projectionData?.confidenceInterval?.high?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-200">
                      <ArrowUp className="w-3 h-3" />
                      Momentum Plus
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone-Specific Payout Optimization */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Zone Optimization Matrix</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zoneOptimization?.map((zone, index) => (
                  <div key={index} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-primary/30 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-white uppercase tracking-widest text-xs">{zone?.zone}</h3>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        zone?.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        zone?.priority === 'Medium'? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {zone?.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Standard</div>
                        <div className="text-xl font-black text-slate-300 tracking-tight">${zone?.currentPayout?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Optimized</div>
                        <div className="text-xl font-black text-primary tracking-tight">${zone?.optimizedPayout?.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-4">
                      <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Expected Yield</div>
                      <div className="text-xs text-slate-300 font-medium">{zone?.expectedIncrease}</div>
                    </div>

                    <div className="text-xs text-slate-500 leading-relaxed font-medium">
                      <span className="font-black text-slate-400 uppercase tracking-widest text-[9px] mr-2">Strategy:</span> {zone?.strategy}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations & Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Revenue Maximization</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {forecast?.recommendations?.map((rec, index) => (
                    <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                          rec?.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                          rec?.priority === 'Medium'? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {rec?.priority} Impact
                        </span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{rec?.timeframe}</span>
                      </div>

                      <h3 className="font-black text-white uppercase tracking-widest text-[10px] mb-3 leading-tight">{rec?.action}</h3>
                      
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Impact Analysis</div>
                        <div className="text-xs text-slate-300 font-medium">{rec?.expectedImpact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-green-500/5 backdrop-blur-xl rounded-3xl border border-green-500/10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Growth Vectors</h2>
                  </div>
                  <ul className="space-y-4">
                    {forecast?.growthFactors?.map((factor, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50 flex-shrink-0" />
                        <span className="text-xs text-slate-400 font-medium leading-relaxed">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-500/5 backdrop-blur-xl rounded-3xl border border-red-500/10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Risk Mitigation</h2>
                  </div>
                  <ul className="space-y-4">
                    {forecast?.riskFactors?.map((factor, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50 flex-shrink-0" />
                        <span className="text-xs text-slate-400 font-medium leading-relaxed">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {!forecast && !loading && (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-[40px] border border-white/5 p-24 text-center shadow-2xl animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
              {!creatorId && authResolved ? 'Authentication Required' : 'Projection Engine Standby'}
            </h3>
            <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              {!creatorId && authResolved
                ? 'Please sign in to access high-fidelity AI-powered creator revenue projections.'
                : 'Initialize the AI core to generate 30-90 day revenue projections with localized payout optimization.'}
            </p>
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
}

export default CreatorRevenueForecastingDashboard;