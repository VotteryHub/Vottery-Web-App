import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { performanceOptimizationService } from '../../../services/performanceOptimizationService';

const PredictiveLoadForecastingPanel = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecastData();
  }, []);

  const loadForecastData = async () => {
    setLoading(true);
    try {
      const { data } = await performanceOptimizationService?.getPredictiveLoadForecasting();
      setForecastData(data);
    } catch (error) {
      console.error('Error loading forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="TrendingUp" size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Predictive Load Forecasting</h3>
            <p className="text-gray-700 dark:text-gray-300">Machine learning-powered load predictions with 30-90 day capacity planning</p>
          </div>
        </div>
      </div>

      {forecastData?.alerts?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-red-600 dark:text-red-400" />
            Active Alerts
          </h3>
          <div className="space-y-3">
            {forecastData?.alerts?.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                alert?.severity === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' :
                alert?.severity === 'warning'? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
              }`}>
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" size={20} className={`${
                    alert?.severity === 'high' ? 'text-red-600 dark:text-red-400' :
                    alert?.severity === 'warning'? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'
                  } mt-0.5`} />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{alert?.message}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Action: {alert?.action}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forecastData?.forecasts?.map((forecast, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{forecast?.timeframe}</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium">
                {forecast?.confidence}% confidence
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Load</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{forecast?.currentLoad} req/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Predicted Load</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{forecast?.predictedLoad} req/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Change</span>
                <span className={`text-sm font-semibold ${
                  forecast?.trend === 'increasing' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}>
                  {forecast?.trend === 'increasing' ? '+' : '-'}{forecast?.changePercentage}%
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recommendation</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">{forecast?.recommendation}</div>
            </div>
          </div>
        ))}
      </div>

      {forecastData?.capacityPlanning && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="BarChart3" size={20} />
            Capacity Planning
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{forecastData?.capacityPlanning?.currentCapacity}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Current Capacity</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{forecastData?.capacityPlanning?.recommendedCapacity}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Recommended</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{forecastData?.capacityPlanning?.timeToCapacity}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Time to Capacity</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">{forecastData?.capacityPlanning?.scalingStrategy}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Strategy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveLoadForecastingPanel;