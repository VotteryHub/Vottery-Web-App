import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ABTestingPanel = ({ taskType, onRunTest, loading }) => {
  const [testData, setTestData] = useState('');
  const [testResult, setTestResult] = useState(null);

  const sampleData = {
    fraud_detection: {
      transactionId: 'TXN-12345',
      amount: 5000,
      userId: 'USER-789',
      location: 'New York, US',
      deviceFingerprint: 'abc123',
      previousTransactions: 45
    },
    content_moderation: {
      content: 'Sample user-generated content for moderation',
      userId: 'USER-456',
      reportCount: 2,
      context: 'Election comment section'
    },
    dispute_resolution: {
      disputeId: 'DISP-789',
      parties: ['User A', 'User B'],
      issue: 'Prize distribution disagreement',
      evidence: ['Screenshot 1', 'Transaction log']
    },
    strategic_planning: {
      currentMetrics: {
        revenue: 45892,
        activeUsers: 12847,
        campaigns: 34
      },
      goals: ['Increase engagement', 'Optimize costs']
    }
  };

  const handleLoadSample = () => {
    setTestData(JSON.stringify(sampleData?.[taskType], null, 2));
  };

  const handleRunTest = async () => {
    try {
      const parsedData = JSON.parse(testData);
      await onRunTest(parsedData);
      setTestResult({ success: true });
    } catch (error) {
      setTestResult({ success: false, error: error?.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="FlaskConical" size={20} />
          Run A/B Test
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Test both models simultaneously with identical input to compare performance
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Test Data (JSON)
              </label>
              <button
                onClick={handleLoadSample}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Load Sample Data
              </button>
            </div>
            <textarea
              value={testData}
              onChange={(e) => setTestData(e?.target?.value)}
              placeholder="Enter JSON test data..."
              className="w-full h-64 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-mono"
            />
          </div>

          <Button
            onClick={handleRunTest}
            disabled={loading || !testData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Running A/B Test...
              </>
            ) : (
              <>
                <Icon name="Play" size={16} />
                Run A/B Test
              </>
            )}
          </Button>
        </div>

        {testResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            testResult?.success
              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2">
              <Icon
                name={testResult?.success ? 'CheckCircle' : 'XCircle'}
                size={20}
                className={testResult?.success ? 'text-green-600' : 'text-red-600'}
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {testResult?.success ? 'Test completed successfully!' : 'Test failed'}
              </span>
            </div>
            {!testResult?.success && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                {testResult?.error}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} />
          Testing Guidelines
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Both models receive identical input simultaneously
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Response time, token usage, and cost are tracked for each model
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Results are stored for historical analysis and trend tracking
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Statistical significance is calculated after multiple tests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABTestingPanel;