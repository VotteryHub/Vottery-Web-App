import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import claudeDisputeService from '../../services/claudeDisputeService';
import { mlModelTrainingService } from '../../services/mlModelTrainingService';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, DollarSign, Clock, FileText, CheckCircle, XCircle, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const InternationalPaymentDisputeResolutionCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('failed-transactions');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [failedTransactions, setFailedTransactions] = useState([]);
  const [currencyDiscrepancies, setCurrencyDiscrepancies] = useState([]);
  const [bankingDelays, setBankingDelays] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [evidence, setEvidence] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [failedTxns, discrepancies, delays] = await Promise.all([
        claudeDisputeService?.getFailedTransactions(),
        claudeDisputeService?.getCurrencyDiscrepancies(),
        claudeDisputeService?.getBankingDelays()
      ]);

      setFailedTransactions(failedTxns || []);
      setCurrencyDiscrepancies(discrepancies || []);
      setBankingDelays(delays || []);
    } catch (error) {
      console.error('Error loading dispute data:', error);
      toast?.error('Failed to load dispute data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeFailedTransaction = async (transaction) => {
    try {
      setAnalyzing(true);
      setSelectedItem(transaction);
      
      const result = await claudeDisputeService?.analyzeFailedTransaction({
        transactionId: transaction?.transactionId,
        amount: transaction?.amount,
        currency: transaction?.currency,
        failureReason: transaction?.failureReason,
        bankingMethod: transaction?.bankingMethod,
        countryCode: transaction?.countryCode,
        timestamp: transaction?.timestamp,
        retryCount: transaction?.retryCount
      });

      setAnalysis(result?.analysis);
      await mlModelTrainingService?.submitCreatorFeedback?.({
        creatorId: transaction?.creatorId || user?.id,
        source: 'stripe_connect',
        type: 'failed_transaction',
        content: { transaction, analysis: result?.analysis },
        label: 'dispute_resolution',
        metadata: { tab: 'failed-transactions' }
      });
      toast?.success('Analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      toast?.error('Failed to analyze transaction');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeCurrencyDiscrepancy = async (discrepancy) => {
    try {
      setAnalyzing(true);
      setSelectedItem(discrepancy);
      
      const result = await claudeDisputeService?.detectCurrencyDiscrepancy({
        expectedAmount: discrepancy?.expectedAmount,
        expectedCurrency: discrepancy?.expectedCurrency,
        actualAmount: discrepancy?.actualAmount,
        actualCurrency: discrepancy?.actualCurrency,
        exchangeRate: discrepancy?.exchangeRate,
        marketRate: discrepancy?.marketRate,
        fees: discrepancy?.fees,
        provider: discrepancy?.provider
      });

      setAnalysis(result?.analysis);
      await mlModelTrainingService?.submitCreatorFeedback?.({
        creatorId: discrepancy?.creatorId || user?.id,
        source: 'stripe_connect',
        type: 'currency_discrepancy',
        content: { discrepancy, analysis: result?.analysis },
        label: 'dispute_resolution',
        metadata: { tab: 'currency-discrepancies' }
      });
      toast?.success('Discrepancy analysis completed');
    } catch (error) {
      console.error('Error analyzing discrepancy:', error);
      toast?.error('Failed to analyze discrepancy');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleInvestigateBankingDelay = async (delay) => {
    try {
      setAnalyzing(true);
      setSelectedItem(delay);
      
      const result = await claudeDisputeService?.investigateBankingDelay({
        payoutId: delay?.payoutId,
        initiatedAt: delay?.initiatedAt,
        expectedCompletion: delay?.expectedCompletion,
        currentStatus: delay?.currentStatus,
        bankingMethod: delay?.bankingMethod,
        countryCode: delay?.countryCode,
        delayDuration: delay?.delayDuration,
        lastUpdate: delay?.lastUpdate
      });

      setAnalysis(result?.analysis);
      await mlModelTrainingService?.submitCreatorFeedback?.({
        creatorId: delay?.creatorId || user?.id,
        source: 'stripe_connect',
        type: 'banking_delay',
        content: { delay, analysis: result?.analysis },
        label: 'dispute_resolution',
        metadata: { tab: 'banking-delays' }
      });
      toast?.success('Investigation completed');
    } catch (error) {
      console.error('Error investigating delay:', error);
      toast?.error('Failed to investigate delay');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateSettlement = async () => {
    if (!selectedItem) return;

    try {
      setAnalyzing(true);
      
      const result = await claudeDisputeService?.generateSettlementWorkflow({
        disputeType: activeTab,
        amount: selectedItem?.amount || selectedItem?.discrepancy,
        parties: {
          creator: selectedItem?.creatorName,
          platform: 'Election Platform'
        },
        evidence: evidence,
        resolutionGoal: 'Fair settlement with creator satisfaction'
      });

      setAnalysis(result?.workflow);
      await mlModelTrainingService?.submitCreatorFeedback?.({
        creatorId: selectedItem?.creatorId || user?.id,
        source: 'stripe_connect',
        type: 'payout_dispute',
        content: { disputeType: activeTab, selectedItem, workflow: result?.workflow, evidence },
        label: 'settlement_workflow',
        metadata: { tab: activeTab }
      });
      toast?.success('Settlement workflow generated');
    } catch (error) {
      console.error('Error generating settlement:', error);
      toast?.error('Failed to generate settlement');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddEvidence = (file) => {
    setEvidence([...evidence, {
      id: Date.now(),
      name: file?.name || 'Evidence Document',
      type: file?.type || 'document',
      uploadedAt: new Date()?.toISOString()
    }]);
    toast?.success('Evidence added successfully');
  };

  const tabs = [
    { id: 'failed-transactions', label: 'Failed Transactions', icon: XCircle },
    { id: 'currency-discrepancies', label: 'Currency Discrepancies', icon: DollarSign },
    { id: 'banking-delays', label: 'Banking Delays', icon: Clock },
    { id: 'evidence', label: 'Evidence Collection', icon: Upload }
  ];

  const renderFailedTransactions = () => (
    <div className="space-y-4">
      {failedTransactions?.map((transaction) => (
        <div key={transaction?.id} className="bg-white rounded-lg border border-red-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Icon icon={XCircle} className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{transaction?.creatorName}</h4>
                <p className="text-sm text-gray-600">{transaction?.transactionId}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              {transaction?.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600">Amount</p>
              <p className="font-semibold text-gray-900">${transaction?.amount} {transaction?.currency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Banking Method</p>
              <p className="font-semibold text-gray-900">{transaction?.bankingMethod}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Country</p>
              <p className="font-semibold text-gray-900">{transaction?.countryCode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Retry Count</p>
              <p className="font-semibold text-gray-900">{transaction?.retryCount}</p>
            </div>
          </div>

          <div className="p-3 bg-red-50 rounded-lg mb-4">
            <p className="text-sm text-red-800">
              <span className="font-medium">Failure Reason:</span> {transaction?.failureReason}
            </p>
          </div>

          <Button
            onClick={() => handleAnalyzeFailedTransaction(transaction)}
            disabled={analyzing}
            className="w-full"
          >
            {analyzing && selectedItem?.id === transaction?.id ? (
              <><Icon icon={Clock} className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Icon icon={FileText} className="w-4 h-4" /> Analyze with Claude AI</>
            )}
          </Button>
        </div>
      ))}
    </div>
  );

  const renderCurrencyDiscrepancies = () => (
    <div className="space-y-4">
      {currencyDiscrepancies?.map((discrepancy) => (
        <div key={discrepancy?.id} className="bg-white rounded-lg border border-orange-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon icon={DollarSign} className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Currency Conversion Issue</h4>
                <p className="text-sm text-gray-600">{discrepancy?.id}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {discrepancy?.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Expected</p>
              <p className="text-lg font-bold text-gray-900">
                ${discrepancy?.expectedAmount} {discrepancy?.expectedCurrency}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Actual</p>
              <p className="text-lg font-bold text-gray-900">
                {discrepancy?.actualAmount} {discrepancy?.actualCurrency}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600">Rate Used</p>
              <p className="font-semibold text-gray-900">{discrepancy?.exchangeRate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Market Rate</p>
              <p className="font-semibold text-gray-900">{discrepancy?.marketRate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Discrepancy</p>
              <p className="font-semibold text-red-600">${discrepancy?.discrepancy}</p>
            </div>
          </div>

          <Button
            onClick={() => handleAnalyzeCurrencyDiscrepancy(discrepancy)}
            disabled={analyzing}
            className="w-full"
          >
            {analyzing && selectedItem?.id === discrepancy?.id ? (
              <><Icon icon={Clock} className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Icon icon={FileText} className="w-4 h-4" /> Detect Discrepancy with Claude AI</>
            )}
          </Button>
        </div>
      ))}
    </div>
  );

  const renderBankingDelays = () => (
    <div className="space-y-4">
      {bankingDelays?.map((delay) => (
        <div key={delay?.id} className="bg-white rounded-lg border border-yellow-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Icon icon={Clock} className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{delay?.creatorName}</h4>
                <p className="text-sm text-gray-600">{delay?.payoutId}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
              {delay?.currentStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600">Amount</p>
              <p className="font-semibold text-gray-900">${delay?.amount} {delay?.currency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Banking Method</p>
              <p className="font-semibold text-gray-900">{delay?.bankingMethod}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Country</p>
              <p className="font-semibold text-gray-900">{delay?.countryCode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Delay Duration</p>
              <p className="font-semibold text-red-600">{delay?.delayDuration}h</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Initiated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(delay?.initiatedAt)?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Expected Completion</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(delay?.expectedCompletion)?.toLocaleString()}
              </p>
            </div>
          </div>

          <Button
            onClick={() => handleInvestigateBankingDelay(delay)}
            disabled={analyzing}
            className="w-full"
          >
            {analyzing && selectedItem?.id === delay?.id ? (
              <><Icon icon={Clock} className="w-4 h-4 animate-spin" /> Investigating...</>
            ) : (
              <><Icon icon={FileText} className="w-4 h-4" /> Investigate with Claude AI</>
            )}
          </Button>
        </div>
      ))}
    </div>
  );

  const renderEvidenceCollection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Evidence</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Icon icon={Upload} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
          <input
            type="file"
            onChange={(e) => e?.target?.files?.[0] && handleAddEvidence(e?.target?.files?.[0])}
            className="hidden"
            id="evidence-upload"
            multiple
          />
          <label htmlFor="evidence-upload">
            <Button as="span" variant="outline" className="cursor-pointer">
              Select Files
            </Button>
          </label>
        </div>

        {evidence?.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Uploaded Evidence ({evidence?.length})</h4>
            <div className="space-y-2">
              {evidence?.map((item) => (
                <div key={item?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon icon={FileText} className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item?.name}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(item?.uploadedAt)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Icon icon={CheckCircle} className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Settlement Workflow</h3>
          <p className="text-gray-600 mb-4">
            Use Claude AI to generate an automated settlement workflow based on collected evidence
          </p>
          <Button
            onClick={handleGenerateSettlement}
            disabled={analyzing || evidence?.length === 0}
            className="w-full"
          >
            {analyzing ? (
              <><Icon icon={Clock} className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Icon icon={FileText} className="w-4 h-4" /> Generate Settlement Workflow</>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>International Payment Dispute Resolution | Creator Platform</title>
        <meta name="description" content="Claude-powered dispute resolution for failed transactions, currency discrepancies, and banking delays" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <HeaderNavigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Icon icon={AlertTriangle} className="w-8 h-8 text-red-600" />
              International Payment Dispute Resolution
            </h1>
            <p className="mt-2 text-gray-600">
              Claude-powered automated investigation and settlement for failed transactions, currency discrepancies, and banking delays
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Dispute List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-4 px-6" aria-label="Tabs">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`
                          flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                          ${
                            activeTab === tab?.id
                              ? 'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon icon={tab?.icon} className="w-5 h-5" />
                        {tab?.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Icon icon={Clock} className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {activeTab === 'failed-transactions' && renderFailedTransactions()}
                      {activeTab === 'currency-discrepancies' && renderCurrencyDiscrepancies()}
                      {activeTab === 'banking-delays' && renderBankingDelays()}
                      {activeTab === 'evidence' && renderEvidenceCollection()}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Analysis Results */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claude AI Analysis</h3>
                
                {analysis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Icon icon={CheckCircle} className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="font-medium text-blue-900">Analysis Complete</p>
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <pre className="whitespace-pre-wrap text-xs">{analysis}</pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon icon={FileText} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Select a dispute and click analyze to see Claude AI investigation results
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InternationalPaymentDisputeResolutionCenter;