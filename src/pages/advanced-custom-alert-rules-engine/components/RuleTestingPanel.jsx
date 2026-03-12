import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RuleTestingPanel = () => {
  const [testData, setTestData] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTestRule = () => {
    setTesting(true);
    setTimeout(() => {
      setTestResult({
        triggered: true,
        matchedConditions: 3,
        totalConditions: 3,
        executionTime: '1.2s',
        actions: ['Fraud Investigation Triggered', 'Stakeholders Notified']
      });
      setTesting(false);
    }, 1500);
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">
        Rule Testing Sandbox
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Test alert rules with simulated data before deploying to production
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Test Data (JSON)
          </label>
          <textarea
            value={testData}
            onChange={(e) => setTestData(e?.target?.value)}
            placeholder={`{\n  "fraud": {\n    "latestFraudScore": 75,\n    "riskLevel": "high"\n  },\n  "financial": {\n    "totalRevenue": 50000,\n    "avgROI": 1.5\n  }\n}`}
            rows={10}
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground font-mono text-sm"
          />
        </div>

        <Button
          variant="primary"
          iconName="Play"
          onClick={handleTestRule}
          disabled={testing || !testData}
          className="w-full"
        >
          {testing ? 'Testing...' : 'Run Test'}
        </Button>

        {testResult && (
          <div className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
              <h3 className="font-semibold text-foreground">Test Result: Rule Triggered</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Matched Conditions:</span>
                <span className="font-medium text-foreground">
                  {testResult?.matchedConditions}/{testResult?.totalConditions}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Execution Time:</span>
                <span className="font-medium text-foreground">{testResult?.executionTime}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Actions Executed:</p>
                <ul className="space-y-1">
                  {testResult?.actions?.map((action, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon name="Zap" size={14} className="text-primary" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleTestingPanel;