import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { securityTestingService } from '../../../services/securityTestingService';

const PenetrationTestingPanel = () => {
  const [tests, setTests] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const testResults = await securityTestingService?.runPenetrationTests();
      setTests(testResults);
    } catch (error) {
      console.error('Failed to load penetration tests:', error);
    }
  };

  const runAllTests = async () => {
    setRunning(true);
    try {
      const results = await securityTestingService?.runPenetrationTests();
      setTests(results);
    } catch (error) {
      console.error('Penetration tests failed:', error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Icon name="Target" size={20} />
            Automated Penetration Testing
          </h3>
          <button
            onClick={runAllTests}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {running ? (
              <>
                <Icon name="Loader" size={14} className="animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Icon name="Play" size={14} />
                Run All Tests
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {tests?.map((test, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{test?.name}</h4>
                  <p className="text-sm text-muted-foreground">{test?.description}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded ${
                  test?.status === 'passed' ? 'bg-green-100 text-green-600' :
                  test?.status === 'failed'? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {test?.status?.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2 font-medium text-foreground">{test?.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-2 font-medium text-foreground">{test?.duration}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Attempts:</span>
                  <span className="ml-2 font-medium text-foreground">{test?.attempts}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span className="ml-2 font-medium text-foreground">{test?.successRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PenetrationTestingPanel;