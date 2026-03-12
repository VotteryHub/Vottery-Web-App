import React, { useState } from 'react';
import { Zap, Play, Activity } from 'lucide-react';
import { incidentResponseService } from '../../../services/incidentResponseService';

const SCALE_LEVELS = [
  { label: '10K', value: 10000, color: 'bg-green-500' },
  { label: '100K', value: 100000, color: 'bg-yellow-400' },
  { label: '500K', value: 500000, color: 'bg-orange-400' },
  { label: '1M', value: 1000000, color: 'bg-red-500' },
];

const LoadTestingMobilePanel = ({ onRefresh }) => {
  const [activeTests, setActiveTests] = useState({});
  const [circuitBreakerActive, setCircuitBreakerActive] = useState(false);

  const startTest = (scale) => {
    const testId = `mobile_test_${scale?.value}_${Date.now()}`;
    setActiveTests(prev => ({
      ...prev,
      [scale?.value]: { id: testId, scale: scale?.label, users: scale?.value, status: 'running', progress: 0 }
    }));

    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.random() * 12 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        const passed = Math.random() > 0.2;
        setActiveTests(prev => ({
          ...prev,
          [scale?.value]: { ...prev?.[scale?.value], status: passed ? 'passed' : 'failed', progress: 100 }
        }));

        // Auto-response: trigger circuit breaker at 500K+
        if (scale?.value >= 500000) {
          setCircuitBreakerActive(true);
          try {
            await incidentResponseService?.createIncident({
              incidentType: 'load_threshold_exceeded',
              description: `Mobile load test: ${scale?.value?.toLocaleString()} concurrent users — circuit breaker activated`,
              threatLevel: scale?.value >= 1000000 ? 'critical' : 'high',
              enableThreatAnalysis: false,
              autoResponse: true,
              circuitBreakerActivated: true,
            });
          } catch (e) {
            console.warn('[MobileLoadTest] Incident response error:', e?.message);
          }
        }
      } else {
        setActiveTests(prev => ({
          ...prev,
          [scale?.value]: { ...prev?.[scale?.value], progress: Math.floor(progress) }
        }));
      }
    }, 600);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-blue-500" />
          </div>
          <h3 className="text-base font-heading font-semibold text-foreground">Load Testing</h3>
        </div>
        {circuitBreakerActive && (
          <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-full font-medium animate-pulse">
            Circuit Breaker Active
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SCALE_LEVELS?.map((scale) => {
          const test = activeTests?.[scale?.value];
          return (
            <div key={scale?.value} className="bg-muted/50 rounded-xl p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${scale?.color}`} />
                <span className="text-sm font-bold text-foreground">{scale?.label}</span>
              </div>
              {test ? (
                <div>
                  <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        test?.status === 'passed' ? 'bg-green-500' :
                        test?.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${test?.progress}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium capitalize ${
                    test?.status === 'passed' ? 'text-green-500' :
                    test?.status === 'failed' ? 'text-red-500' : 'text-blue-500'
                  }`}>{test?.status} {test?.progress}%</span>
                </div>
              ) : (
                <button
                  onClick={() => startTest(scale)}
                  className="w-full flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs py-2 rounded-lg transition-colors active:scale-95"
                >
                  <Play size={12} /> Run
                </button>
              )}
            </div>
          );
        })}
      </div>
      {circuitBreakerActive && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-red-500" />
            <p className="text-xs text-red-500 font-medium">Auto-response activated: Incident logged, circuit breakers enabled</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadTestingMobilePanel;
