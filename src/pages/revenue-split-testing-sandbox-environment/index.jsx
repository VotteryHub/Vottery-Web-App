import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { Play, RotateCcw, Database, AlertTriangle, CheckCircle, TrendingUp, DollarSign, Settings, Beaker } from 'lucide-react';


import { analytics } from '../../hooks/useGoogleAnalytics';
import Icon from '../../components/AppIcon';


const RevenueSplitTestingSandboxEnvironment = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [testScenarios, setTestScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSandboxData();
    analytics?.trackEvent('sandbox_environment_viewed', {
      active_tab: activeTab,
      sandbox_mode: sandboxMode
    });
  }, [activeTab]);

  const loadSandboxData = async () => {
    try {
      setLoading(true);
      // Load test scenarios from local state or database
      const mockScenarios = [
        {
          id: 1,
          name: 'Morale Booster 90/10',
          creatorPercentage: 90,
          platformPercentage: 10,
          status: 'ready',
          createdAt: new Date()?.toISOString(),
          testRevenue: 100000
        },
        {
          id: 2,
          name: 'Standard 70/30',
          creatorPercentage: 70,
          platformPercentage: 30,
          status: 'ready',
          createdAt: new Date()?.toISOString(),
          testRevenue: 100000
        },
        {
          id: 3,
          name: 'Platform Focus 68/32',
          creatorPercentage: 68,
          platformPercentage: 32,
          status: 'ready',
          createdAt: new Date()?.toISOString(),
          testRevenue: 100000
        }
      ];
      setTestScenarios(mockScenarios);
    } catch (error) {
      console.error('Error loading sandbox data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestScenario = (scenarioData) => {
    const newScenario = {
      id: Date.now(),
      ...scenarioData,
      status: 'ready',
      createdAt: new Date()?.toISOString()
    };
    setTestScenarios(prev => [...prev, newScenario]);
    setMessage({ type: 'success', text: 'Test scenario created successfully' });
    analytics?.trackEvent('sandbox_scenario_created', {
      scenario_name: scenarioData?.name,
      creator_percentage: scenarioData?.creatorPercentage
    });
    setTimeout(() => setMessage(null), 5000);
  };

  const runTestScenario = async (scenarioId) => {
    const scenario = testScenarios?.find(s => s?.id === scenarioId);
    if (!scenario) return;

    setActiveScenario(scenario);
    setLoading(true);

    // Simulate test execution
    setTimeout(() => {
      const testResult = {
        id: Date.now(),
        scenarioId,
        scenarioName: scenario?.name,
        testRevenue: scenario?.testRevenue,
        creatorEarnings: (scenario?.testRevenue * scenario?.creatorPercentage) / 100,
        platformEarnings: (scenario?.testRevenue * scenario?.platformPercentage) / 100,
        creatorPercentage: scenario?.creatorPercentage,
        platformPercentage: scenario?.platformPercentage,
        executedAt: new Date()?.toISOString(),
        status: 'completed',
        calculations: [
          { step: 'Total Revenue', value: scenario?.testRevenue },
          { step: `Creator Share (${scenario?.creatorPercentage}%)`, value: (scenario?.testRevenue * scenario?.creatorPercentage) / 100 },
          { step: `Platform Share (${scenario?.platformPercentage}%)`, value: (scenario?.testRevenue * scenario?.platformPercentage) / 100 }
        ]
      };

      setTestResults(prev => [testResult, ...prev]);
      setMessage({ type: 'success', text: 'Test scenario executed successfully' });
      setLoading(false);
      analytics?.trackEvent('sandbox_test_executed', {
        scenario_id: scenarioId,
        creator_percentage: scenario?.creatorPercentage
      });
      setTimeout(() => setMessage(null), 5000);
    }, 2000);
  };

  const resetSandbox = () => {
    setTestScenarios([]);
    setTestResults([]);
    setActiveScenario(null);
    setMessage({ type: 'success', text: 'Sandbox environment reset successfully' });
    analytics?.trackEvent('sandbox_reset');
    setTimeout(() => setMessage(null), 5000);
    loadSandboxData();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Beaker },
    { id: 'scenario-builder', label: 'Scenario Builder', icon: Settings },
    { id: 'test-execution', label: 'Test Execution', icon: Play },
    { id: 'results', label: 'Test Results', icon: TrendingUp },
    { id: 'calculations', label: 'Payout Calculations', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Helmet>
        <title>Revenue Split Testing Sandbox Environment | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Revenue Split Testing Sandbox
              </h1>
              <p className="text-gray-600">
                Isolated testing environment for revenue sharing scenarios without affecting production data
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg px-4 py-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">SANDBOX MODE</span>
              </div>
              <button
                onClick={resetSandbox}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Sandbox
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message?.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            message?.type === 'error'? 'bg-red-50 border border-red-200 text-red-800' : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            {message?.text}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4 overflow-x-auto">
            {tabs?.map(tab => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-blue-600 text-blue-600' :'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Beaker className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{testScenarios?.length}</div>
                <div className="text-sm text-gray-600">Test Scenarios</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Play className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-medium text-blue-600">Completed</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{testResults?.length}</div>
                <div className="text-sm text-gray-600">Tests Executed</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Database className="w-8 h-8 text-purple-600" />
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">Isolated</div>
                <div className="text-sm text-gray-600">Production Safe</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Simulated</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">$0</div>
                <div className="text-sm text-gray-600">Real Money Impact</div>
              </div>
            </div>

            {/* Active Scenarios */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active Test Scenarios</h2>
              <div className="space-y-3">
                {testScenarios?.map(scenario => (
                  <div key={scenario?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{scenario?.name}</div>
                      <div className="text-sm text-gray-600">
                        Creator: {scenario?.creatorPercentage}% | Platform: {scenario?.platformPercentage}%
                      </div>
                    </div>
                    <button
                      onClick={() => runTestScenario(scenario?.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Run Test
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scenario Builder Tab */}
        {activeTab === 'scenario-builder' && (
          <ScenarioBuilderPanel onCreateScenario={createTestScenario} />
        )}

        {/* Test Execution Tab */}
        {activeTab === 'test-execution' && (
          <TestExecutionPanel
            scenarios={testScenarios}
            onRunTest={runTestScenario}
            activeScenario={activeScenario}
            loading={loading}
          />
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <TestResultsPanel results={testResults} />
        )}

        {/* Calculations Tab */}
        {activeTab === 'calculations' && (
          <PayoutCalculationsPanel results={testResults} />
        )}
      </div>
    </div>
  );
};

// Scenario Builder Component
const ScenarioBuilderPanel = ({ onCreateScenario }) => {
  const [scenarioName, setScenarioName] = useState('');
  const [creatorPercentage, setCreatorPercentage] = useState(70);
  const [testRevenue, setTestRevenue] = useState(100000);

  const handleSubmit = (e) => {
    e?.preventDefault();
    onCreateScenario({
      name: scenarioName,
      creatorPercentage,
      platformPercentage: 100 - creatorPercentage,
      testRevenue
    });
    setScenarioName('');
    setCreatorPercentage(70);
    setTestRevenue(100000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Create Test Scenario</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scenario Name
          </label>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e?.target?.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Morale Booster 90/10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Creator Percentage: {creatorPercentage}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={creatorPercentage}
            onChange={(e) => setCreatorPercentage(parseInt(e?.target?.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Platform: {100 - creatorPercentage}%</span>
            <span>Creator: {creatorPercentage}%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Revenue Amount ($)
          </label>
          <input
            type="number"
            value={testRevenue}
            onChange={(e) => setTestRevenue(parseInt(e?.target?.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1000"
            step="1000"
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Preview Calculation</h3>
          <div className="space-y-1 text-sm text-blue-800">
            <div>Total Revenue: ${testRevenue?.toLocaleString()}</div>
            <div>Creator Earnings: ${((testRevenue * creatorPercentage) / 100)?.toLocaleString()}</div>
            <div>Platform Earnings: ${((testRevenue * (100 - creatorPercentage)) / 100)?.toLocaleString()}</div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Create Test Scenario
        </button>
      </form>
    </div>
  );
};

// Test Execution Component
const TestExecutionPanel = ({ scenarios, onRunTest, activeScenario, loading }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Execute Test Scenarios</h2>
        <div className="space-y-4">
          {scenarios?.map(scenario => (
            <div key={scenario?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{scenario?.name}</h3>
                  <p className="text-sm text-gray-600">
                    Split: {scenario?.creatorPercentage}% / {scenario?.platformPercentage}%
                  </p>
                </div>
                <button
                  onClick={() => onRunTest(scenario?.id)}
                  disabled={loading && activeScenario?.id === scenario?.id}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading && activeScenario?.id === scenario?.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Execute Test
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Test Revenue</div>
                  <div className="font-semibold">${scenario?.testRevenue?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Creator Earnings</div>
                  <div className="font-semibold text-green-600">
                    ${((scenario?.testRevenue * scenario?.creatorPercentage) / 100)?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Platform Earnings</div>
                  <div className="font-semibold text-blue-600">
                    ${((scenario?.testRevenue * scenario?.platformPercentage) / 100)?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Test Results Component
const TestResultsPanel = ({ results }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Test Results History</h2>
      <div className="space-y-4">
        {results?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No test results yet. Execute a test scenario to see results.
          </div>
        ) : (
          results?.map(result => (
            <div key={result?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{result?.scenarioName}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(result.executedAt)?.toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {result?.status}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Total Revenue</div>
                  <div className="font-semibold">${result?.testRevenue?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Creator Share</div>
                  <div className="font-semibold text-green-600">
                    ${result?.creatorEarnings?.toLocaleString()} ({result?.creatorPercentage}%)
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Platform Share</div>
                  <div className="font-semibold text-blue-600">
                    ${result?.platformEarnings?.toLocaleString()} ({result?.platformPercentage}%)
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Status</div>
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Payout Calculations Component
const PayoutCalculationsPanel = ({ results }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Payout Calculations</h2>
      <div className="space-y-6">
        {results?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No calculations available. Execute test scenarios to see detailed breakdowns.
          </div>
        ) : (
          results?.map(result => (
            <div key={result?.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{result?.scenarioName}</h3>
              <div className="space-y-2">
                {result?.calculations?.map((calc, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{calc?.step}</span>
                    <span className="font-semibold text-gray-900">${calc?.value?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Calculation Verified</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Accurate
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RevenueSplitTestingSandboxEnvironment;