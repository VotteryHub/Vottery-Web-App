import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import claudeDisputeService from '../../services/claudeDisputeService';
import { mlModelTrainingService } from '../../services/mlModelTrainingService';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, DollarSign, Clock, FileText, CheckCircle, XCircle, Upload, ShieldAlert, ArrowUpRight, Scale, Search, Filter, Loader2, Info, ChevronRight, Gavel } from 'lucide-react';
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
    { id: 'currency-discrepancies', label: 'Currency Issues', icon: DollarSign },
    { id: 'banking-delays', label: 'Banking Delays', icon: Clock },
    { id: 'evidence', label: 'Evidence Collection', icon: Upload }
  ];

  const renderFailedTransactions = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {failedTransactions?.map((transaction) => (
        <div key={transaction?.id} className="premium-glass bg-destructive/5 rounded-2xl border border-destructive/20 p-6 group hover:shadow-lg transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <XCircle size={80} />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive">
                <XCircle size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">{transaction?.creatorName}</h4>
                <p className="text-xs font-medium text-muted-foreground font-data uppercase tracking-widest">{transaction?.transactionId}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {transaction?.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
            {[
              { label: 'Amount', value: `$${transaction?.amount} ${transaction?.currency}` },
              { label: 'Method', value: transaction?.bankingMethod },
              { label: 'Country', value: transaction?.countryCode },
              { label: 'Retries', value: transaction?.retryCount }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-background/40 rounded-xl border border-border/30">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/10 mb-6 relative z-10">
            <p className="text-xs text-destructive-900/80 leading-relaxed">
              <span className="font-bold uppercase tracking-tight mr-2">Failure Reason:</span> {transaction?.failureReason}
            </p>
          </div>

          <Button
            onClick={() => handleAnalyzeFailedTransaction(transaction)}
            disabled={analyzing}
            className="w-full rounded-xl py-6 font-bold tracking-widest text-xs shadow-lg shadow-destructive/10"
          >
            {analyzing && selectedItem?.id === transaction?.id ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> ANALYZING DISPUTE...</>
            ) : (
              <><ShieldAlert size={16} className="mr-2" /> ANALYZE WITH CLAUDE AI</>
            )}
          </Button>
        </div>
      ))}
    </div>
  );

  const renderCurrencyDiscrepancies = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {currencyDiscrepancies?.map((discrepancy) => (
        <div key={discrepancy?.id} className="premium-glass bg-warning/5 rounded-2xl border border-warning/20 p-6 group hover:shadow-lg transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center text-warning">
                <DollarSign size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">Currency Conversion Anomaly</h4>
                <p className="text-xs font-medium text-muted-foreground font-data uppercase tracking-widest">{discrepancy?.id}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {discrepancy?.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
            <div className="p-4 bg-background/60 rounded-2xl border border-border/30">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Expected Remittance</p>
              <p className="text-2xl font-black text-foreground font-data">
                ${discrepancy?.expectedAmount} <span className="text-sm font-normal text-muted-foreground">{discrepancy?.expectedCurrency}</span>
              </p>
            </div>
            <div className="p-4 bg-background/60 rounded-2xl border border-border/30">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Actual Settlement</p>
              <p className="text-2xl font-black text-foreground font-data">
                {discrepancy?.actualAmount} <span className="text-sm font-normal text-muted-foreground">{discrepancy?.actualCurrency}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
            {[
              { label: 'Internal Rate', value: discrepancy?.exchangeRate },
              { label: 'Market Rate', value: discrepancy?.marketRate },
              { label: 'Discrepancy', value: `$${discrepancy?.discrepancy}`, color: 'text-destructive' }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-background/40 rounded-xl border border-border/30">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-sm font-bold ${item.color || 'text-foreground'}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => handleAnalyzeCurrencyDiscrepancy(discrepancy)}
            disabled={analyzing}
            className="w-full rounded-xl py-6 font-bold tracking-widest text-xs bg-warning hover:bg-warning/90 text-white shadow-lg shadow-warning/10"
          >
            {analyzing && selectedItem?.id === discrepancy?.id ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> TRACING FOREX PROTOCOLS...</>
            ) : (
              <><Search size={16} className="mr-2" /> DETECT FOREX DISCREPANCY</>
            )}
          </Button>
        </div>
      ))}
    </div>
  );

  const renderBankingDelays = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {bankingDelays?.map((delay) => (
        <div key={delay?.id} className="premium-glass bg-primary/5 rounded-2xl border border-primary/20 p-6 group hover:shadow-lg transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Clock size={80} />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">{delay?.creatorName}</h4>
                <p className="text-xs font-medium text-muted-foreground font-data uppercase tracking-widest">{delay?.payoutId}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {delay?.currentStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
            {[
              { label: 'Amount', value: `$${delay?.amount} ${delay?.currency}` },
              { label: 'Method', value: delay?.bankingMethod },
              { label: 'Country', value: delay?.countryCode },
              { label: 'Delay Duration', value: `${delay?.delayDuration}h`, color: 'text-destructive' }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-background/40 rounded-xl border border-border/30">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-sm font-bold ${item.color || 'text-foreground'}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10">
            <div className="p-4 bg-background/60 rounded-2xl border border-border/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Initiated</p>
                <p className="text-xs font-bold text-foreground">{new Date(delay?.initiatedAt)?.toLocaleString()}</p>
              </div>
            </div>
            <div className="p-4 bg-background/60 rounded-2xl border border-border/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Expected</p>
                <p className="text-xs font-bold text-foreground">{new Date(delay?.expectedCompletion)?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleInvestigateBankingDelay(delay)}
            disabled={analyzing}
            className="w-full rounded-xl py-6 font-bold tracking-widest text-xs shadow-lg shadow-primary/10"
          >
            {analyzing && selectedItem?.id === delay?.id ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> INVESTIGATING BANKING HOPS...</>
            ) : (
              <><Search size={16} className="mr-2" /> INVESTIGATE WITH CLAUDE AI</>
            )}
          </Button>
        </div>
      ))}
    </div>
  );

  const renderEvidenceCollection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="premium-glass bg-card/40 p-8 rounded-3xl border border-border/50">
        <h3 className="text-xl font-bold text-foreground mb-6">Evidence Acquisition Hub</h3>
        
        <div className="border-2 border-dashed border-border/50 rounded-3xl p-12 text-center bg-background/20 hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden">
          <input
            type="file"
            onChange={(e) => e?.target?.files?.[0] && handleAddEvidence(e?.target?.files?.[0])}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            id="evidence-upload"
            multiple
          />
          <div className="relative z-0">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <p className="text-lg font-bold text-foreground mb-2">Deploy Evidence Assets</p>
            <p className="text-sm text-muted-foreground mb-6">Drag and drop localized banking receipts, dispute letters, or screenshot evidence.</p>
            <Button variant="outline" as="span" className="rounded-xl px-8 border-border/50 bg-card/40">
              BROWSE FILES
            </Button>
          </div>
        </div>

        {evidence?.length > 0 && (
          <div className="mt-8 animate-in fade-in duration-700">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              Acquired Evidence ({evidence?.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evidence?.map((item) => (
                <div key={item?.id} className="flex items-center justify-between p-4 bg-background/60 rounded-2xl border border-border/30 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item?.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        {new Date(item?.uploadedAt)?.toLocaleDateString()} • {item?.type}
                      </p>
                    </div>
                  </div>
                  <CheckCircle size={18} className="text-success" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="premium-glass bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-3xl border border-primary/20 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-foreground mb-2">Automated Settlement Protocol</h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xl">
              Initialize a high-fidelity settlement workflow using Claude AI analysis and collected evidence to resolve the international dispute with optimal outcome metrics.
            </p>
            <Button
              onClick={handleGenerateSettlement}
              disabled={analyzing || evidence?.length === 0}
              className="w-full md:w-auto px-10 py-6 rounded-2xl font-bold tracking-widest text-xs shadow-xl shadow-primary/20"
            >
              {analyzing ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> GENERATING PROTOCOL...</>
              ) : (
                <><Gavel size={16} className="mr-2" /> INITIALIZE SETTLEMENT WORKFLOW</>
              )}
            </Button>
            {!evidence?.length && (
              <p className="text-[10px] text-destructive font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                <Info size={12} /> Requires evidence assets to initialize
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <GeneralPageLayout title="Dispute Center" showSidebar={true}>
      <Helmet>
        <title>International Payment Dispute Resolution | Vottery Admin</title>
        <meta name="description" content="Claude-powered dispute resolution for international financial anomalies" />
      </Helmet>

      <div className="w-full py-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                  <Scale size={24} />
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                  International Dispute Center
                </h1>
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
                Claude-powered automated investigation and settlement for failed transactions, currency discrepancies, and banking delays
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadData} className="rounded-xl border-border/50 bg-card/40">
                <Icon name="RefreshCw" size={14} className="mr-2" />
                Sync Disputes
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Workspace */}
          <div className="xl:col-span-2 space-y-8">
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-2xl w-fit border border-border/50">
                {tabs?.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab?.id;
                  return (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                        isActive
                          ? 'bg-card text-foreground shadow-lg shadow-black/5 border border-border/50'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <IconComp size={16} />
                      <span className="text-sm font-bold tracking-tight">{tab?.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-card/20 backdrop-blur-xl border border-border/50 rounded-3xl">
                  <Loader2 size={48} className="animate-spin text-primary mb-6" />
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest italic">Synchronizing International Ledger...</p>
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

          {/* Analysis Sidebar */}
          <div className="xl:col-span-1">
            <div className="premium-glass bg-card/40 rounded-3xl border border-border/50 sticky top-8 overflow-hidden flex flex-col h-fit max-h-[calc(100vh-8rem)]">
              <div className="p-6 border-b border-border/30 bg-primary/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Icon name="Brain" size={20} className="text-primary" />
                  Claude AI Insight
                </h3>
                {analysis && (
                  <span className="px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    SYNCED
                  </span>
                )}
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
                {analysis ? (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-5 bg-background/60 rounded-2xl border border-primary/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                        <CheckCircle size={40} className="text-primary" />
                      </div>
                      <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CheckCircle size={16} />
                        Protocol Analysis Complete
                      </h4>
                      <div className="text-sm text-foreground/90 leading-relaxed font-medium">
                        <pre className="whitespace-pre-wrap font-sans leading-relaxed">{analysis}</pre>
                      </div>
                    </div>
                    <div className="p-5 bg-background/40 rounded-2xl border border-border/30">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Suggested Next Steps</h4>
                      <div className="space-y-2">
                        {[
                          'Validate evidence against ledger hash',
                          'Trigger regional settlement contract',
                          'Update creator trust reputation score'
                        ].map((step, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-card/20 rounded-xl border border-border/10 hover:border-primary/20 transition-all cursor-pointer group">
                            <span className="text-xs font-bold text-foreground/80 group-hover:text-foreground transition-colors">{step}</span>
                            <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center text-muted-foreground mb-6 border border-border/50">
                      <Icon name="FileText" size={40} className="opacity-20" />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-2">Awaiting Case Selection</p>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                      Initialize a dispute analysis from the workspace to generate Claude AI intelligence.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-muted/20 border-t border-border/30">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <ShieldAlert size={12} />
                  Compliance Gated Session
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default InternationalPaymentDisputeResolutionCenter;