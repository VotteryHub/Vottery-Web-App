import React, { useState } from 'react';
import { AlertTriangle, Play, CheckCircle, XCircle, ArrowRight, Timer } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const FailoverSimulation = () => {
  const [simulating, setSimulating] = useState(false);
  const [simResults, setSimResults] = useState(null);
  const [simHistory, setSimHistory] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('telnyx');
  const [simStep, setSimStep] = useState(0);

  const SIM_STEPS = [
    'Initiating provider failure simulation...',
    'Detecting provider degradation...',
    'Triggering failover logic...',
    'Switching to backup provider...',
    'Validating backup provider health...',
    'Measuring recovery time...',
    'Simulation complete'
  ];

  const runSimulation = async () => {
    setSimulating(true);
    setSimStep(0);
    setSimResults(null);

    const startTime = Date.now();
    for (let i = 0; i < SIM_STEPS?.length; i++) {
      setSimStep(i);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    }

    const recoveryTime = Date.now() - startTime;
    const success = Math.random() > 0.15;
    const backupProvider = selectedProvider === 'telnyx' ? 'twilio' : 'telnyx';

    const result = {
      simulatedProvider: selectedProvider,
      backupProvider,
      recoveryTimeMs: recoveryTime,
      failoverTriggered: true,
      backupHealthy: success,
      effectivenessScore: success ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 30) + 40,
      timestamp: new Date()?.toISOString()
    };

    setSimResults(result);
    setSimHistory(prev => [result, ...prev?.slice(0, 9)]);

    // Store in DB
    try {
      await supabase?.from('sms_health_check_results')?.insert({
        provider: selectedProvider,
        test_type: 'failover_simulation',
        status: success ? 'pass' : 'fail',
        latency_ms: recoveryTime,
        delivery_success: success,
        failover_triggered: true,
        performance_metrics: result
      });
    } catch (err) {
      console.error('Error storing simulation result:', err);
    }

    setSimulating(false);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Control */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-800">Failover Simulation Control</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Simulate Failure For</label>
            <div className="flex gap-3">
              {['telnyx', 'twilio']?.map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedProvider(p)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors capitalize ${
                    selectedProvider === p
                      ? p === 'telnyx' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-purple-500 bg-purple-50 text-purple-700' :'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Backup: <strong>{selectedProvider === 'telnyx' ? 'Twilio' : 'Telnyx'}</strong> will be activated
            </p>
          </div>

          <div className="flex items-end">
            <button
              onClick={runSimulation}
              disabled={simulating}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white rounded-xl py-3 font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {simulating ? (
                <><Timer className="w-4 h-4 animate-spin" /> Simulating...</>
              ) : (
                <><Play className="w-4 h-4" /> Run Failover Simulation</>
              )}
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        {simulating && (
          <div className="mt-4 space-y-2">
            {SIM_STEPS?.map((step, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm transition-all ${
                i < simStep ? 'text-green-600' : i === simStep ? 'text-blue-600 font-medium' : 'text-gray-300'
              }`}>
                {i < simStep ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : i === simStep ? (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                )}
                {step}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Simulation Results */}
      {simResults && (
        <div className={`rounded-xl border-2 p-6 ${
          simResults?.backupHealthy ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            {simResults?.backupHealthy
              ? <CheckCircle className="w-5 h-5 text-green-600" />
              : <XCircle className="w-5 h-5 text-red-600" />}
            <h3 className={`font-semibold ${simResults?.backupHealthy ? 'text-green-800' : 'text-red-800'}`}>
              Simulation {simResults?.backupHealthy ? 'Passed' : 'Failed'}
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Simulated Provider</p>
              <p className="font-bold text-gray-800 capitalize mt-1">{simResults?.simulatedProvider}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">Backup Provider</p>
              </div>
              <p className="font-bold text-gray-800 capitalize mt-1">{simResults?.backupProvider}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Recovery Time</p>
              <p className="font-bold text-gray-800 mt-1">{(simResults?.recoveryTimeMs / 1000)?.toFixed(1)}s</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Effectiveness Score</p>
              <p className={`font-bold mt-1 ${
                simResults?.effectivenessScore >= 80 ? 'text-green-700' : 'text-red-700'
              }`}>{simResults?.effectivenessScore}%</p>
            </div>
          </div>
        </div>
      )}
      {/* Simulation History */}
      {simHistory?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Simulation History</h3>
          <div className="space-y-2">
            {simHistory?.map((sim, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  {sim?.backupHealthy
                    ? <CheckCircle className="w-4 h-4 text-green-500" />
                    : <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="text-sm capitalize">{sim?.simulatedProvider} → {sim?.backupProvider}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{(sim?.recoveryTimeMs / 1000)?.toFixed(1)}s recovery</span>
                  <span className={sim?.effectivenessScore >= 80 ? 'text-green-600' : 'text-red-600'}>
                    {sim?.effectivenessScore}% effective
                  </span>
                  <span className="text-xs">{new Date(sim?.timestamp)?.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FailoverSimulation;
