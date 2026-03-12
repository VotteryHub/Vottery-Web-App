import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import MixnetConfigurationPanel from './components/MixnetConfigurationPanel';
import VoteAnonymizationPanel from './components/VoteAnonymizationPanel';
import PrivacyMetricsPanel from './components/PrivacyMetricsPanel';
import MixingSchedulePanel from './components/MixingSchedulePanel';
import Icon from '../../components/AppIcon';
import { mixnetService } from '../../services/mixnetService';

const VoteAnonymityMixnetControlHub = () => {
  const [nodeStatus, setNodeStatus] = useState([]);
  const [queueStatus, setQueueStatus] = useState(null);
  const [privacyMetrics, setPrivacyMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState('overview');

  const loadMixnetData = async () => {
    try {
      const [nodesResult, queueResult, metricsResult] = await Promise.all([
        mixnetService?.getNodeStatus(),
        mixnetService?.getQueueStatus(),
        mixnetService?.getPrivacyMetrics()
      ]);
      
      setNodeStatus(nodesResult?.data || []);
      setQueueStatus(queueResult?.data);
      setPrivacyMetrics(metricsResult?.data);
    } catch (error) {
      console.error('Failed to load mixnet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMixnetData();
    const interval = setInterval(loadMixnetData, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeNodes = nodeStatus?.filter(node => node?.status === 'active')?.length;
  const totalThroughput = nodeStatus?.reduce((sum, node) => sum + (node?.throughput || 0), 0);

  return (
    <>
      <Helmet>
        <title>Vote Anonymity & Mixnet Control Hub | Vottery</title>
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        <HeaderNavigation />
        <div className="flex flex-1">
          <ElectionsSidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                      Vote Anonymity & Mixnet Control Hub
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Advanced vote anonymization through cryptographic mixnets and privacy-preserving protocols
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-success">Mixing Active</span>
                  </div>
                </div>

                {/* Mixnet Status Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Server" size={16} color="var(--color-primary)" />
                      </div>
                      <div className="w-2 h-2 bg-success rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Active Nodes</p>
                    <p className="text-2xl font-bold text-foreground">{activeNodes}/{nodeStatus?.length}</p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Activity" size={16} color="var(--color-secondary)" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Total Throughput</p>
                    <p className="text-2xl font-bold text-foreground">{totalThroughput?.toLocaleString()}/s</p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon name="Users" size={16} color="var(--color-accent)" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Anonymity Set Size</p>
                    <p className="text-2xl font-bold text-foreground">{privacyMetrics?.anonymitySetSize?.toLocaleString()}</p>
                  </div>

                  <div className="bg-success/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                        <Icon name="Shield" size={16} color="var(--color-success)" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Privacy Effectiveness</p>
                    <p className="text-2xl font-bold text-success">{privacyMetrics?.mixingEffectiveness}%</p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-card rounded-xl p-2 border border-border">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
                    { id: 'configuration', label: 'Mixnet Configuration', icon: 'Settings' },
                    { id: 'anonymization', label: 'Vote Anonymization', icon: 'Shuffle' },
                    { id: 'privacy', label: 'Privacy Metrics', icon: 'Eye' },
                    { id: 'schedule', label: 'Mixing Schedule', icon: 'Clock' }
                  ]?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActivePanel(tab?.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-250 ${
                        activePanel === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="text-sm font-medium">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel Content */}
              {activePanel === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Activity" size={20} color="var(--color-primary)" />
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-foreground">Anonymization Queue</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <span className="text-sm font-medium text-foreground">{queueStatus?.pending}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Processing</span>
                        <span className="text-sm font-medium text-warning">{queueStatus?.processing}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <span className="text-sm font-medium text-success">{queueStatus?.completed?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg Processing Time</span>
                        <span className="text-sm font-medium text-foreground">{queueStatus?.averageProcessingTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Icon name="Shield" size={20} color="var(--color-success)" />
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-foreground">Privacy Guarantees</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                        <Icon name="Check" size={16} className="text-success" />
                        <span className="text-sm text-foreground">Complete Vote Unlinkability</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                        <Icon name="Check" size={16} className="text-success" />
                        <span className="text-sm text-foreground">Cryptographic Shuffling</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                        <Icon name="Check" size={16} className="text-success" />
                        <span className="text-sm text-foreground">Re-encryption Cascades</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                        <Icon name="Check" size={16} className="text-success" />
                        <span className="text-sm text-foreground">Zero-Knowledge Integration</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'configuration' && <MixnetConfigurationPanel nodes={nodeStatus} />}
              {activePanel === 'anonymization' && <VoteAnonymizationPanel />}
              {activePanel === 'privacy' && <PrivacyMetricsPanel metrics={privacyMetrics} />}
              {activePanel === 'schedule' && <MixingSchedulePanel />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default VoteAnonymityMixnetControlHub;