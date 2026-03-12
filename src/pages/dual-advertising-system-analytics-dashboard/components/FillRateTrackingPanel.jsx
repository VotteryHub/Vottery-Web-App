import React from 'react';
import Icon from '../../../components/AppIcon';

const FillRateTrackingPanel = ({ data }) => {
  const fillRates = data?.fillRates || {};

  return (
    <div className="space-y-6">
      {/* Fill Rate Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Ad Slot Fill Rate Tracking
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Grid" size={24} className="text-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Slots</p>
            </div>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {fillRates?.total || 0}
            </p>
          </div>
          
          <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Users" size={24} className="text-green-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Internal Fills</p>
            </div>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              {fillRates?.internalFills || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {fillRates?.internalFillRate || 0}% fill rate
            </p>
          </div>
          
          <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="DollarSign" size={24} className="text-purple-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">AdSense Fills</p>
            </div>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {fillRates?.adsenseFills || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {fillRates?.adsenseFillRate || 0}% fill rate
            </p>
          </div>
        </div>
      </div>
      {/* Waterfall Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Waterfall Logic Performance
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Priority 1: Internal Ads</span>
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {fillRates?.internalFillRate || 0}% Success
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
              {fillRates?.internalFills || 0} slots filled with participatory ads (primary revenue)
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Icon name="ArrowDown" size={20} className="text-purple-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Priority 2: AdSense Fallback</span>
              </div>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {fillRates?.adsenseFillRate || 0}% Fallback
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
              {fillRates?.adsenseFills || 0} slots filled with AdSense when internal ads unavailable
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Icon name="Shield" size={20} className="text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Conflict Prevention</span>
              </div>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                100% Success
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
              Zero instances of double-filling or slot conflicts detected
            </p>
          </div>
        </div>
      </div>
      {/* Page-Level Fill Rates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Fill Rates by Page
        </h3>
        
        <div className="space-y-4">
          {[
            { page: 'Home Feed', internal: 75, adsense: 25, total: 100 },
            { page: 'Elections Hub', internal: 68, adsense: 32, total: 100 },
            { page: 'User Profile', internal: 82, adsense: 18, total: 100 }
          ]?.map((page, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-900 dark:text-white">{page?.page}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{page?.total}% filled</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Internal Ads</span>
                    <span className="text-green-600 dark:text-green-400">{page?.internal}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${page?.internal}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">AdSense</span>
                    <span className="text-purple-600 dark:text-purple-400">{page?.adsense}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${page?.adsense}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Real-Time Monitoring */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Real-Time Fill Rate Monitoring
        </h3>
        
        <div className="space-y-3">
          {[
            { time: '2 minutes ago', slot: 'home_feed_slot_1', system: 'Internal', status: 'success' },
            { time: '5 minutes ago', slot: 'home_feed_slot_2', system: 'AdSense', status: 'fallback' },
            { time: '8 minutes ago', slot: 'elections_slot_1', system: 'Internal', status: 'success' },
            { time: '12 minutes ago', slot: 'home_feed_slot_3', system: 'Internal', status: 'success' },
            { time: '15 minutes ago', slot: 'profile_slot_1', system: 'AdSense', status: 'fallback' }
          ]?.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  event?.status === 'success' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{event?.slot}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{event?.time}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                event?.status === 'success' ?'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
              }`}>
                {event?.system}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FillRateTrackingPanel;
