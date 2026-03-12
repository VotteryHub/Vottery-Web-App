import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { pushNotificationService } from '../../../services/pushNotificationService';

const SmartTimingEngine = ({ timingData, onRefresh }) => {
  const [testUserId, setTestUserId] = useState('');
  const [testType, setTestType] = useState('general');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const notificationTypes = ['general', 'votes', 'messages', 'achievements', 'election_updates'];

  const handleTest = async () => {
    if (!testUserId) return;
    setTesting(true);
    try {
      const result = await pushNotificationService?.getOptimalTiming(testUserId, testType);
      setTestResult(result);
    } catch (err) {
      console.error('Test failed:', err);
    } finally {
      setTesting(false);
    }
  };

  const scheduleOptions = [
    { type: 'votes', label: 'Vote Reminders', description: 'Notify users about active elections', icon: 'Vote', color: 'text-purple-600' },
    { type: 'messages', label: 'Message Alerts', description: 'Direct message notifications', icon: 'MessageCircle', color: 'text-green-600' },
    { type: 'achievements', label: 'Achievement Unlocks', description: 'Badge and milestone notifications', icon: 'Award', color: 'text-yellow-600' },
    { type: 'election_updates', label: 'Election Updates', description: 'Results and status changes', icon: 'BarChart2', color: 'text-blue-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Timing Algorithm Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Cpu" size={20} className="text-blue-500" />
          Smart Timing Algorithm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduleOptions?.map(opt => (
            <div key={opt?.type} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Icon name={opt?.icon} size={18} className={opt?.color} />
                <span className="font-medium text-foreground">{opt?.label}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{opt?.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Optimal window:</span>
                <span className="text-sm font-semibold text-foreground">
                  {timingData?.optimalHour != null ? `${timingData?.optimalHour}:00` : '9:00'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Test Timing for User */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="FlaskConical" size={20} className="text-green-500" />
          Test Timing Analysis
        </h3>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter User ID"
            value={testUserId}
            onChange={e => setTestUserId(e?.target?.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <select
            value={testType}
            onChange={e => setTestType(e?.target?.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          >
            {notificationTypes?.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={handleTest}
            disabled={!testUserId || testing}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {testing ? <Icon name="Loader" size={16} className="animate-spin" /> : 'Analyze'}
          </button>
        </div>

        {testResult && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Analysis Result</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Optimal Hour:</span> <span className="font-medium">{testResult?.optimalHour}:00</span></div>
              <div><span className="text-muted-foreground">Confidence:</span> <span className="font-medium">{testResult?.confidenceScore}%</span></div>
              <div><span className="text-muted-foreground">Data Points:</span> <span className="font-medium">{testResult?.totalDataPoints}</span></div>
              <div><span className="text-muted-foreground">Next Send:</span> <span className="font-medium">{testResult?.nextOptimalTime ? new Date(testResult.nextOptimalTime)?.toLocaleTimeString() : 'N/A'}</span></div>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">{testResult?.recommendation}</p>
          </div>
        )}
      </div>
      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-foreground rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <Icon name="RefreshCw" size={16} />
        Refresh Analysis
      </button>
    </div>
  );
};

export default SmartTimingEngine;
