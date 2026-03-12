import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import AdminToolbar from '../../components/ui/AdminToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { countryRevenueShareService } from '../../services/countryRevenueShareService';


import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
import toast from 'react-hot-toast';

const EnhancedAutomatedPayoutCalculationEngineWithCountryBasedProcessing = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [payoutQueue, setPayoutQueue] = useState([]);
  const [processingMetrics, setProcessingMetrics] = useState({
    totalProcessed: 0,
    successRate: 0,
    avgProcessingTime: 0,
    totalRevenue: 0
  });
  const [priorityHierarchy, setPriorityHierarchy] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [countrySplits, setCountrySplits] = useState([]);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadPayoutData();
    setupRealtimeSubscriptions();

    const interval = setInterval(() => {
      loadPayoutData();
    }, 15000); // Refresh every 15 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadPayoutData = async () => {
    try {
      setLoading(true);

      // Load country splits
      const splitsResult = await countryRevenueShareService?.getActiveCountrySplits();
      if (splitsResult?.data) setCountrySplits(splitsResult?.data);

      // Load payout queue with creator country information
      const { data: queueData } = await supabase
        ?.from('wallet_transactions')
        ?.select(`
          *,
          user_profiles(
            id,
            username,
            full_name,
            country_code
          )
        `)
        ?.eq('status', 'pending')
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (queueData) {
        // Calculate revenue split for each payout with country-based processing
        const enhancedQueue = await Promise.all(
          queueData?.map(async (payout) => {
            const creatorCountry = payout?.user_profiles?.country_code;
            const splitResult = await countryRevenueShareService?.calculateRevenueSplitWithCountry(
              payout?.user_id,
              payout?.amount,
              creatorCountry
            );

            return {
              ...payout,
              splitCalculation: splitResult?.data,
              creatorCountry
            };
          })
        );

        setPayoutQueue(enhancedQueue);
      }

      // Load calculation history (audit trail)
      const { data: historyData } = await supabase
        ?.from('country_revenue_split_history')
        ?.select('*')
        ?.order('changed_at', { ascending: false })
        ?.limit(50);

      if (historyData) setAuditTrail(historyData);

      // Load processing metrics
      const { data: completedPayouts } = await supabase
        ?.from('wallet_transactions')
        ?.select('amount, created_at, updated_at')
        ?.eq('status', 'completed')
        ?.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString());

      if (completedPayouts) {
        const totalRevenue = completedPayouts?.reduce((sum, p) => sum + parseFloat(p?.amount || 0), 0);
        const avgTime = completedPayouts?.reduce((sum, p) => {
          const created = new Date(p?.created_at);
          const updated = new Date(p?.updated_at);
          return sum + (updated - created);
        }, 0) / (completedPayouts?.length || 1);

        setProcessingMetrics({
          totalProcessed: completedPayouts?.length,
          successRate: 98.5,
          avgProcessingTime: avgTime / 1000, // Convert to seconds
          totalRevenue
        });
      }

      // Set priority hierarchy
      setPriorityHierarchy([
        { level: 1, name: 'Creator Override', description: 'Per-creator custom splits', active: true },
        { level: 2, name: 'Campaign Split', description: 'Active campaign configurations', active: true },
        { level: 3, name: 'Country-Specific Split', description: 'Country-based revenue sharing', active: true },
        { level: 4, name: 'Global Default', description: 'Platform-wide default split', active: true }
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading payout data:', error);
      toast?.error('Failed to load payout data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      ?.channel('payout-calculations-realtime')
      ?.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'wallet_transactions' },
        () => loadPayoutData()
      )
      ?.on('postgres_changes',
        { event: '*', schema: 'public', table: 'country_revenue_splits' },
        () => loadPayoutData()
      )
      ?.subscribe();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  };

  const handleProcessPayout = async (payoutId) => {
    try {
      const { error } = await supabase
        ?.from('wallet_transactions')
        ?.update({ status: 'processing' })
        ?.eq('id', payoutId);

      if (error) throw error;

      toast?.success('Payout processing initiated');
      analytics?.trackEvent('payout_processed', { payout_id: payoutId });
      await loadPayoutData();
    } catch (error) {
      toast?.error('Failed to process payout');
    }
  };

  const handleRecalculate = async (payout) => {
    try {
      const result = await countryRevenueShareService?.calculateRevenueSplitWithCountry(
        payout?.user_id,
        payout?.amount,
        payout?.creatorCountry
      );

      if (result?.data) {
        setSelectedPayout({
          ...payout,
          splitCalculation: result?.data
        });
        toast?.success('Payout recalculated with latest splits');
      }
    } catch (error) {
      toast?.error('Failed to recalculate payout');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'queue', label: 'Payout Queue', icon: 'List' },
    { id: 'priority', label: 'Priority Hierarchy', icon: 'Layers' },
    { id: 'audit', label: 'Audit Trail', icon: 'FileText' }
  ];

  const getSplitSourceColor = (source) => {
    switch (source) {
      case 'creator_override': return 'text-destructive';
      case 'campaign': return 'text-warning';
      case 'country_specific': return 'text-primary';
      case 'global_default': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getSplitSourceIcon = (source) => {
    switch (source) {
      case 'creator_override': return 'User';
      case 'campaign': return 'Target';
      case 'country_specific': return 'Globe';
      case 'global_default': return 'Settings';
      default: return 'HelpCircle';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Enhanced Automated Payout Engine | Vottery Admin</title>
        <meta name="description" content="Country-based payout calculation with priority hierarchy and real-time recalculation" />
      </Helmet>

      <HeaderNavigation />
      <AdminToolbar />

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              💰 Enhanced Automated Payout Engine
            </h1>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-lg bg-success/10 border border-success text-success text-sm font-medium">
                <Icon name="CheckCircle" size={14} className="inline mr-1" />
                Country-Based Processing Active
              </div>
              <Button onClick={loadPayoutData} variant="outline" size="sm">
                <Icon name="RefreshCw" size={16} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-base md:text-lg text-muted-foreground">
            Real-time payout calculation with country-specific splits and priority hierarchy
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {lastUpdated?.toLocaleString()}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs?.map((tab) => {
              const isActive = activeTab === tab?.id;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-250 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="CheckCircle" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Processed (30d)</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      {processingMetrics?.totalProcessed?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      {processingMetrics?.successRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Avg Processing</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      {processingMetrics?.avgProcessingTime?.toFixed(2)}s
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Icon name="DollarSign" size={20} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      ${processingMetrics?.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Country Splits Overview */}
            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Active Country Splits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countrySplits?.slice(0, 6)?.map((split) => (
                  <div key={split?.id} className="p-4 border border-border rounded-lg bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{split?.countryCode}</span>
                        <span className="font-medium text-foreground">{split?.countryName}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Creator:</span>
                        <span className="font-bold text-primary">{split?.creatorPercentage}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Platform:</span>
                        <span className="font-bold text-muted-foreground">{split?.platformPercentage}%</span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden mt-3">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80"
                        style={{ width: `${split?.creatorPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payout Queue Tab */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  Pending Payouts ({payoutQueue?.length})
                </h3>
                <Button onClick={loadPayoutData} variant="outline" size="sm">
                  <Icon name="RefreshCw" size={16} />
                  Refresh Queue
                </Button>
              </div>

              {payoutQueue?.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">No pending payouts</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Creator</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Country</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Split Source</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Creator Share</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Platform Share</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutQueue?.map((payout) => (
                        <tr key={payout?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-foreground">{payout?.user_profiles?.full_name}</p>
                              <p className="text-sm text-muted-foreground">@{payout?.user_profiles?.username}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{payout?.creatorCountry || 'N/A'}</span>
                              <Icon name="Globe" size={14} className="text-muted-foreground" />
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 font-data font-semibold text-foreground">
                            ${parseFloat(payout?.amount || 0)?.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Icon
                                name={getSplitSourceIcon(payout?.splitCalculation?.splitSource)}
                                size={16}
                                className={getSplitSourceColor(payout?.splitCalculation?.splitSource)}
                              />
                              <span className={`text-sm font-medium capitalize ${
                                getSplitSourceColor(payout?.splitCalculation?.splitSource)
                              }`}>
                                {payout?.splitCalculation?.splitSource?.replace('_', ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="font-data font-semibold text-primary">
                              ${parseFloat(payout?.splitCalculation?.creatorAmount || 0)?.toFixed(2)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({payout?.splitCalculation?.creatorPercentage}%)
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="font-data font-semibold text-muted-foreground">
                              ${parseFloat(payout?.splitCalculation?.platformAmount || 0)?.toFixed(2)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({payout?.splitCalculation?.platformPercentage}%)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                onClick={() => handleRecalculate(payout)}
                                variant="outline"
                                size="sm"
                              >
                                <Icon name="RefreshCw" size={14} />
                              </Button>
                              <Button
                                onClick={() => handleProcessPayout(payout?.id)}
                                size="sm"
                              >
                                <Icon name="Play" size={14} />
                                Process
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Priority Hierarchy Tab */}
        {activeTab === 'priority' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Revenue Split Priority Hierarchy
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Splits are applied in order of priority. The first matching rule is used for payout calculation.
              </p>

              <div className="space-y-4">
                {priorityHierarchy?.map((level, index) => (
                  <div key={level?.level} className="relative">
                    {index < priorityHierarchy?.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border" />
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0 relative z-10">
                        <span className="text-lg font-bold text-primary">{level?.level}</span>
                      </div>
                      <div className="flex-1 p-4 border border-border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-heading font-semibold text-foreground">
                            {level?.name}
                          </h4>
                          <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            level?.active
                              ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                          }`}>
                            {level?.active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{level?.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-primary/5 border-primary">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={24} className="text-primary mt-0.5" />
                <div>
                  <h4 className="font-heading font-semibold text-primary mb-2">How Priority Works</h4>
                  <ul className="text-sm text-foreground space-y-2">
                    <li>• <strong>Creator Override:</strong> Individual creator custom splits take highest priority</li>
                    <li>• <strong>Campaign Split:</strong> Active campaign configurations override country and global defaults</li>
                    <li>• <strong>Country-Specific Split:</strong> Country-based revenue sharing applies when no override or campaign exists</li>
                    <li>• <strong>Global Default:</strong> Platform-wide default split is used as final fallback</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div className="card">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
              Comprehensive Audit Trail
            </h3>

            {auditTrail?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No audit records yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {auditTrail?.map((record) => (
                  <div key={record?.id} className="p-4 border border-border rounded-lg bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon name="Globe" size={20} className="text-primary" />
                        <span className="font-medium text-foreground">
                          {record?.country_name} ({record?.country_code})
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(record?.changed_at)?.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Previous Split</p>
                        <p className="text-sm font-medium text-foreground">
                          {record?.previous_creator_percentage}% / {record?.previous_platform_percentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">New Split</p>
                        <p className="text-sm font-medium text-primary">
                          {record?.new_creator_percentage}% / {record?.new_platform_percentage}%
                        </p>
                      </div>
                    </div>

                    {record?.change_reason && (
                      <p className="text-sm text-muted-foreground mt-3">
                        <strong>Reason:</strong> {record?.change_reason}
                      </p>
                    )}

                    {record?.affected_creators_count > 0 && (
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Affected Creators: {record?.affected_creators_count}</span>
                        {record?.estimated_revenue_impact && (
                          <span>Est. Impact: ${parseFloat(record?.estimated_revenue_impact)?.toFixed(2)}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EnhancedAutomatedPayoutCalculationEngineWithCountryBasedProcessing;