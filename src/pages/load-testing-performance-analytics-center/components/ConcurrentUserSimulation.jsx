import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ConcurrentUserSimulation = ({ data, activeTest, onStartTest }) => {
  const [testConfig, setTestConfig] = useState({
    users: 1000,
    rampUpTime: 60,
    duration: 300,
    pattern: 'linear'
  });

  const simulationData = [
    { time: 0, users: 0, responseTime: 0 },
    { time: 60, users: 200, responseTime: 145 },
    { time: 120, users: 400, responseTime: 178 },
    { time: 180, users: 600, responseTime: 198 },
    { time: 240, users: 800, responseTime: 234 },
    { time: 300, users: 1000, responseTime: 267 }
  ];

  const loadPatterns = [
    { id: 'linear', name: 'Linear Ramp-Up', description: 'Gradual increase in user load' },
    { id: 'spike', name: 'Spike Test', description: 'Sudden traffic surge' },
    { id: 'sustained', name: 'Sustained Load', description: 'Constant user traffic' },
    { id: 'wave', name: 'Wave Pattern', description: 'Periodic traffic fluctuation' }
  ];

  return (
    <div className="space-y-6">
      {/* Current Load Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Users" size={24} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-green-600 dark:text-green-400">+23</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{data?.concurrentUsers?.current}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Users</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">24h peak</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{data?.concurrentUsers?.peak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Peak Load</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Target" size={24} className="text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">capacity</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{data?.concurrentUsers?.target}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Target Capacity</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Activity" size={24} className="text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-green-600 dark:text-green-400">optimal</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{data?.concurrentUsers?.utilizationRate}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Utilization</div>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} className="text-primary" />
          Test Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Concurrent Users
            </label>
            <input
              type="number"
              value={testConfig?.users}
              onChange={(e) => setTestConfig({ ...testConfig, users: parseInt(e?.target?.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ramp-Up Time (seconds)
            </label>
            <input
              type="number"
              value={testConfig?.rampUpTime}
              onChange={(e) => setTestConfig({ ...testConfig, rampUpTime: parseInt(e?.target?.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Test Duration (seconds)
            </label>
            <input
              type="number"
              value={testConfig?.duration}
              onChange={(e) => setTestConfig({ ...testConfig, duration: parseInt(e?.target?.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Load Pattern
            </label>
            <select
              value={testConfig?.pattern}
              onChange={(e) => setTestConfig({ ...testConfig, pattern: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {loadPatterns?.map((pattern) => (
                <option key={pattern?.id} value={pattern?.id}>{pattern?.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => onStartTest?.(testConfig)}
            disabled={activeTest?.status === 'running'}
            className="flex items-center gap-2"
          >
            <Icon name="Play" size={16} />
            Start Simulation
          </Button>
          {activeTest?.status === 'running' && (
            <Button variant="outline" className="flex items-center gap-2">
              <Icon name="Square" size={16} />
              Stop Test
            </Button>
          )}
        </div>
      </div>

      {/* Load Pattern Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          User Load Simulation
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={simulationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }} />
            <YAxis yAxisId="left" stroke="#9ca3af" label={{ value: 'Users', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'Response Time (ms)', angle: 90, position: 'insideRight' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Concurrent Users" />
            <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#10b981" strokeWidth={2} name="Response Time" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Load Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loadPatterns?.map((pattern) => (
          <div key={pattern?.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Zap" size={20} className="text-primary" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{pattern?.name}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{pattern?.description}</p>
          </div>
        ))}
      </div>

      {/* Active Test Status */}
      {activeTest?.status === 'running' && (
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-900/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Test Running</h3>
            </div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Started: {new Date(activeTest?.startTime)?.toLocaleTimeString()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Target Users</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{activeTest?.users}</div>
            </div>
            <div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Duration</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{activeTest?.duration}s</div>
            </div>
            <div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Pattern</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 capitalize">{activeTest?.pattern}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConcurrentUserSimulation;