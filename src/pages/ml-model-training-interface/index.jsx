import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { mlModelTrainingService } from '../../services/mlModelTrainingService';
import { analytics } from '../../hooks/useGoogleAnalytics';

import ModelPerformancePanel from './components/ModelPerformancePanel';
import TrainingDatasetPanel from './components/TrainingDatasetPanel';
import ModelConfigurationPanel from './components/ModelConfigurationPanel';
import TrainingPipelinePanel from './components/TrainingPipelinePanel';
import ModelComparisonPanel from './components/ModelComparisonPanel';
import AutomatedRetrainingPanel from './components/AutomatedRetrainingPanel';

const MLModelTrainingInterface = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [trainingData, setTrainingData] = useState({
    modelPerformance: [],
    trainingDatasets: [],
    retrainingSchedule: null,
    activeTraining: null
  });

  useEffect(() => {
    loadTrainingData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    analytics?.trackEvent('ml_training_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      
      const [performanceResult, datasetsResult, retrainingResult] = await Promise.all([
        mlModelTrainingService?.getModelPerformance(),
        mlModelTrainingService?.getTrainingDatasets(),
        mlModelTrainingService?.getAutomatedRetraining()
      ]);

      setTrainingData({
        modelPerformance: performanceResult?.data || [],
        trainingDatasets: datasetsResult?.data || [],
        retrainingSchedule: retrainingResult?.data,
        activeTraining: null
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadTrainingData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'performance', label: 'Model Performance', icon: 'TrendingUp' },
    { id: 'datasets', label: 'Training Datasets', icon: 'Database' },
    { id: 'configuration', label: 'Model Configuration', icon: 'Settings' },
    { id: 'pipeline', label: 'Training Pipeline', icon: 'GitBranch' },
    { id: 'comparison', label: 'Model Comparison', icon: 'BarChart2' },
    { id: 'automation', label: 'Automated Retraining', icon: 'Zap' }
  ];

  return (
    <>
      <Helmet>
        <title>ML Model Training Interface - Vottery</title>
        <meta name="description" content="Admin interface for refining and optimizing fraud detection algorithms through comprehensive model management and performance analytics." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  ML Model Training Interface
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Refine and optimize fraud detection algorithms with comprehensive model management
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  Updated {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? 'Loader' : 'RefreshCw'}
                  onClick={refreshData}
                  disabled={refreshing}
                  iconClassName={refreshing ? 'animate-spin' : ''}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading training data...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'performance' && (
                <ModelPerformancePanel 
                  modelPerformance={trainingData?.modelPerformance}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'datasets' && (
                <TrainingDatasetPanel 
                  trainingDatasets={trainingData?.trainingDatasets}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'configuration' && (
                <ModelConfigurationPanel 
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'pipeline' && (
                <TrainingPipelinePanel 
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'comparison' && (
                <ModelComparisonPanel 
                  modelPerformance={trainingData?.modelPerformance}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'automation' && (
                <AutomatedRetrainingPanel 
                  retrainingSchedule={trainingData?.retrainingSchedule}
                  onRefresh={refreshData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default MLModelTrainingInterface;