import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OperationConfigPanel from './components/OperationConfigPanel';
import ProgressTrackingPanel from './components/ProgressTrackingPanel';
import OperationHistoryPanel from './components/OperationHistoryPanel';
import RollbackManagementPanel from './components/RollbackManagementPanel';
import { bulkManagementService } from '../../services/bulkManagementService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const BulkManagementScreen = () => {
  const [activeTab, setActiveTab] = useState('configure');
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

  useEffect(() => {
    loadOperations();
    loadStatistics();
    analytics?.trackEvent('bulk_management_screen_viewed', {
      active_tab: activeTab
    });
  }, []);

  const loadOperations = async () => {
    setLoading(true);
    try {
      const result = await bulkManagementService?.getBulkOperations({ limit: 50 });
      if (result?.data) {
        setOperations(result?.data);
      }
    } catch (error) {
      console.error('Failed to load operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const result = await bulkManagementService?.getBulkOperationStatistics('30d');
      if (result?.data) {
        setStatistics(result?.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleCreateOperation = async (operationData) => {
    try {
      const result = await bulkManagementService?.createBulkOperation(operationData);
      if (result?.data) {
        setOperations([result?.data, ...operations]);
        setActiveTab('progress');
        setSelectedOperation(result?.data);
      }
    } catch (error) {
      console.error('Failed to create operation:', error);
    }
  };

  const handleExecuteOperation = async (operationId) => {
    try {
      await bulkManagementService?.executeBulkOperation(operationId);
      await loadOperations();
    } catch (error) {
      console.error('Failed to execute operation:', error);
    }
  };

  const handleRollbackOperation = async (operationId) => {
    try {
      await bulkManagementService?.rollbackBulkOperation(operationId);
      await loadOperations();
    } catch (error) {
      console.error('Failed to rollback operation:', error);
    }
  };

  const tabs = [
    { id: 'configure', label: 'Configure Operation', icon: 'Settings' },
    { id: 'progress', label: 'Progress Tracking', icon: 'Activity', badge: operations?.filter(op => op?.status === 'processing')?.length || 0 },
    { id: 'history', label: 'Operation History', icon: 'History' },
    { id: 'rollback', label: 'Rollback Management', icon: 'RotateCcw' }
  ];

  return (
    <>
      <Helmet>
        <title>Bulk Management Screen - Vottery</title>
        <meta name="description" content="Process multiple elections, users, or compliance submissions simultaneously with progress tracking and automated rollback capabilities." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8 mt-14">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Bulk Management Screen
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Process multiple entities simultaneously with progress tracking and automated rollback
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={() => {
                  loadOperations();
                  loadStatistics();
                }}
              >
                Refresh
              </Button>
            </div>
          </div>

          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Operations</span>
                  <Icon name="Database" size={20} className="text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{statistics?.totalOperations}</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <Icon name="CheckCircle2" size={20} className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{statistics?.successRate}%</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Items Processed</span>
                  <Icon name="TrendingUp" size={20} className="text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{statistics?.totalItemsProcessed}</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Rolled Back</span>
                  <Icon name="RotateCcw" size={20} className="text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{statistics?.rolledBackOperations}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted/50 border border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                  {tab?.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab?.id
                        ? 'bg-white/20 text-white' :'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading bulk operations...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'configure' && (
                <OperationConfigPanel onCreateOperation={handleCreateOperation} />
              )}
              {activeTab === 'progress' && (
                <ProgressTrackingPanel 
                  operations={operations?.filter(op => op?.status === 'processing' || op?.status === 'pending')} 
                  onExecute={handleExecuteOperation}
                  onRefresh={loadOperations}
                />
              )}
              {activeTab === 'history' && (
                <OperationHistoryPanel 
                  operations={operations} 
                  onSelectOperation={setSelectedOperation}
                />
              )}
              {activeTab === 'rollback' && (
                <RollbackManagementPanel 
                  operations={operations?.filter(op => op?.rollbackEnabled && op?.status === 'completed')} 
                  onRollback={handleRollbackOperation}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default BulkManagementScreen;