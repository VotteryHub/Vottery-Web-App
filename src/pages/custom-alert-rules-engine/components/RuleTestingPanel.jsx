import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { alertRulesEngineService } from '../../../services/alertRulesEngineService';

const RuleTestingPanel = () => {
  const [testData, setTestData] = useState('');
  const [testRule, setTestRule] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    if (!testRule || !testData) {
      alert('Please provide both rule configuration and test data');
      return;
    }

    try {
      setTesting(true);
      const parsedData = JSON.parse(testData);
      const { data, error } = await alertRulesEngineService?.testRule(testRule, parsedData);
      
      if (error) {
        setTestResult({ success: false, error: error?.message });
      } else {
        setTestResult({ success: true, result: data });
      }
    } catch (error) {
      setTestResult({ success: false, error: error?.message });
    } finally {
      setTesting(false);
    }
  };

  const sampleTestData = {
    fraudDetection: {
      fraudScore: 85,
      confidence: 0.92
    },
    financial: {
      transactionVolume: 1500,
      velocity: 65
    },
    auth: {
      failedLogins: 7,
      suspiciousIPs: 4
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TestTube" size={20} />
          Rule Testing Sandbox
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Test your alert rules with sample data before deploying them to production
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Test Data (JSON)
            </label>
            <textarea
              value={testData}
              onChange={(e) => setTestData(e?.target?.value)}
              placeholder={JSON.stringify(sampleTestData, null, 2)}
              className="w-full h-64 p-3 bg-muted border border-border rounded-lg text-sm font-mono text-foreground"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              onClick={() => setTestData(JSON.stringify(sampleTestData, null, 2))}
              className="mt-2"
            >
              Use Sample Data
            </Button>
          </div>

          <Button
            variant="primary"
            iconName="Play"
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? 'Testing...' : 'Run Test'}
          </Button>
        </div>
      </div>

      {testResult && (
        <div className={`card border-l-4 ${
          testResult?.success
            ? testResult?.result?.triggered
              ? 'border-l-red-500' :'border-l-green-500' :'border-l-yellow-500'
        }`}>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name={testResult?.success ? 'CheckCircle' : 'AlertCircle'} size={20} />
            Test Results
          </h3>
          {testResult?.success ? (
            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Rule Triggered:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    testResult?.result?.triggered
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :'bg-green-100 text-green-600 dark:bg-green-900/20'
                  }`}>
                    {testResult?.result?.triggered ? 'YES' : 'NO'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{testResult?.result?.reason}</p>
              </div>

              {testResult?.result?.conditionResults && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Condition Results:</p>
                  <div className="space-y-2">
                    {testResult?.result?.conditionResults?.map((cond, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {cond?.field} {cond?.operator} {JSON.stringify(cond?.expectedValue)}
                          </span>
                          <Icon
                            name={cond?.triggered ? 'CheckCircle' : 'XCircle'}
                            size={16}
                            className={cond?.triggered ? 'text-green-600' : 'text-red-600'}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Actual: {JSON.stringify(cond?.actualValue)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
              <p className="text-sm text-foreground">Error: {testResult?.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RuleTestingPanel;