import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { datadogAPMService } from '../../../services/datadogAPMService';

const PredictiveScalingPanel = () => {
  const [scalingAlerts, setScalingAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScalingAlerts();
  }, []);

  const loadScalingAlerts = async () => {
    try {
      const { data, error } = await datadogAPMService?.getPredictiveScalingAlerts();
      if (error) throw error;
      setScalingAlerts(data || []);
    } catch (error) {
      console.error('Error loading scaling alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      default: return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
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
      {/* Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Predictive Scaling Alerts
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Machine learning-powered traffic pattern analysis with automated scaling recommendations
        </p>
      </div>

      {/* Scaling Alerts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Icon name="Bell" size={20} />
          Active Scaling Alerts
        </h3>

        {scalingAlerts?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No scaling alerts - infrastructure is optimally sized</p>
          </div>
        ) : (
          scalingAlerts?.map((alert, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert?.severity)}`}>
                      {alert?.severity?.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {alert?.type?.replace('_', ' ')?.toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {alert?.confidence}% Confidence
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {alert?.endpoint}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {alert?.message}
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Icon name="Lightbulb" size={16} />
                  Recommended Action
                </h5>
                <p className="text-sm text-blue-800 dark:text-blue-400">{alert?.recommendation}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Traffic Pattern Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Traffic Pattern Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Peak Traffic Hours</span>
              <Icon name="TrendingUp" size={16} className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">9 AM - 5 PM</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Weekdays</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Growth Rate</span>
              <Icon name="TrendingUp" size={16} className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">+23%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Last 7 days</div>
          </div>
        </div>
      </div>

      {/* Performance Thresholds */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Sliders" size={20} />
          Performance Thresholds
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Response Time Threshold</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">2000ms</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Error Rate Threshold</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">5%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">CPU Utilization Threshold</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">80%</span>
          </div>
        </div>
      </div>

      {/* Cost Optimization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} />
          Cost Optimization Strategies
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-green-800 dark:text-green-400">Auto-scaling during peak hours</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-green-800 dark:text-green-400">Scale down during off-peak</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-green-800 dark:text-green-400">Estimated monthly savings: $450</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveScalingPanel;