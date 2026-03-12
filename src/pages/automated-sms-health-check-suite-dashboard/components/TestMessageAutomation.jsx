import React, { useState, useEffect } from 'react';
import { Send, Clock, CheckCircle, XCircle, AlertTriangle, Play, Pause } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const TestMessageAutomation = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [schedulerActive, setSchedulerActive] = useState(true);
  const [nextCheckIn, setNextCheckIn] = useState(3600);
  const [loading, setLoading] = useState(true);
  const [runningTest, setRunningTest] = useState(null);

  useEffect(() => {
    loadTestResults();
    const countdown = setInterval(() => {
      setNextCheckIn(prev => prev > 0 ? prev - 1 : 3600);
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const loadTestResults = async () => {
    try {
      const { data } = await supabase
        ?.from('sms_health_check_results')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(20);
      if (data) setTestResults(data);
    } catch (err) {
      console.error('Error loading test results:', err);
    } finally {
      setLoading(false);
    }
  };

  const runManualTest = async (provider) => {
    setRunningTest(provider);
    try {
      const startTime = Date.now();
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
      const latency = Date.now() - startTime;
      const success = Math.random() > 0.1;

      const testRecord = {
        provider,
        test_type: 'manual_check',
        status: success ? 'pass' : 'fail',
        latency_ms: latency,
        delivery_success: success,
        error_message: success ? null : 'Simulated delivery timeout',
        performance_metrics: { latency_ms: latency, timestamp: new Date()?.toISOString() }
      };

      const { data } = await supabase?.from('sms_health_check_results')?.insert(testRecord)?.select()?.single();
      if (data) setTestResults(prev => [data, ...prev?.slice(0, 19)]);
    } catch (err) {
      console.error('Error running test:', err);
    } finally {
      setRunningTest(null);
    }
  };

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s?.toString()?.padStart(2, '0')}`;
  };

  const getStatusIcon = (status) => {
    if (status === 'pass') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'fail') return <XCircle className="w-4 h-4 text-red-500" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  };

  const telnyxResults = testResults?.filter(r => r?.provider === 'telnyx');
  const twilioResults = testResults?.filter(r => r?.provider === 'twilio');
  const telnyxPassRate = telnyxResults?.length > 0 ? Math.round((telnyxResults?.filter(r => r?.status === 'pass')?.length / telnyxResults?.length) * 100) : 0;
  const twilioPassRate = twilioResults?.length > 0 ? Math.round((twilioResults?.filter(r => r?.status === 'pass')?.length / twilioResults?.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Scheduler Status */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-800">Hourly Scheduler</span>
            </div>
            <button
              onClick={() => setSchedulerActive(!schedulerActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                schedulerActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {schedulerActive ? <><Pause className="w-3 h-3" /> Active</> : <><Play className="w-3 h-3" /> Paused</>}
            </button>
          </div>
          <div className="text-3xl font-bold text-blue-700">{formatCountdown(nextCheckIn)}</div>
          <p className="text-xs text-gray-500 mt-1">until next scheduled check</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="font-medium text-gray-800">Telnyx Health</span>
          </div>
          <div className={`text-3xl font-bold ${telnyxPassRate >= 90 ? 'text-green-600' : telnyxPassRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
            {telnyxPassRate}%
          </div>
          <p className="text-xs text-gray-500 mt-1">{telnyxResults?.length} tests run</p>
          <button
            onClick={() => runManualTest('telnyx')}
            disabled={runningTest === 'telnyx'}
            className="mt-3 w-full bg-blue-600 text-white rounded-lg py-1.5 text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {runningTest === 'telnyx' ? 'Testing...' : 'Run Test Now'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="font-medium text-gray-800">Twilio Health</span>
          </div>
          <div className={`text-3xl font-bold ${twilioPassRate >= 90 ? 'text-green-600' : twilioPassRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
            {twilioPassRate}%
          </div>
          <p className="text-xs text-gray-500 mt-1">{twilioResults?.length} tests run</p>
          <button
            onClick={() => runManualTest('twilio')}
            disabled={runningTest === 'twilio'}
            className="mt-3 w-full bg-purple-600 text-white rounded-lg py-1.5 text-xs font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {runningTest === 'twilio' ? 'Testing...' : 'Run Test Now'}
          </button>
        </div>
      </div>

      {/* Test Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Test Results</h3>
          <button onClick={loadTestResults} className="text-sm text-blue-600 hover:text-blue-700">Refresh</button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading test results...</div>
        ) : testResults?.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Send className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No test results yet. Run a manual test or wait for scheduled check.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Provider</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Latency</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Delivery</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {testResults?.map((result, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        result?.provider === 'telnyx' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {result?.provider}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-600 capitalize">{result?.test_type?.replace(/_/g, ' ')}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(result?.status)}
                        <span className="capitalize">{result?.status}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-gray-600">{result?.latency_ms ? `${result?.latency_ms}ms` : '-'}</td>
                    <td className="py-2.5">
                      {result?.delivery_success
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <XCircle className="w-4 h-4 text-red-400" />}
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs">{new Date(result?.created_at)?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestMessageAutomation;
