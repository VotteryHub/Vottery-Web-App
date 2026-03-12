import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { mlModelTrainingService } from '../../../services/mlModelTrainingService';

const TrainingPipelinePanel = ({ onRefresh }) => {
  const [training, setTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingResults, setTrainingResults] = useState(null);

  const handleStartTraining = async () => {
    setTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    const trainingData = {
      historicalCases: 15420,
      fraudRate: 2.3,
      averageLoss: 450
    };

    const modelConfig = {
      algorithm: 'random_forest',
      learningRate: 0.01,
      maxDepth: 10
    };

    const result = await mlModelTrainingService?.trainModel(trainingData, modelConfig);
    
    clearInterval(progressInterval);
    setTrainingProgress(100);
    setTrainingResults(result?.data);
    setTraining(false);
    
    if (onRefresh) onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Training Pipeline</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Execute model training with data preprocessing, validation, and A/B testing
        </p>

        {!training && !trainingResults && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Database" size={20} className="text-blue-600" />
                  <h4 className="text-sm font-semibold text-foreground">Step 1</h4>
                </div>
                <p className="text-xs text-muted-foreground">Data Preprocessing</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Zap" size={20} className="text-purple-600" />
                  <h4 className="text-sm font-semibold text-foreground">Step 2</h4>
                </div>
                <p className="text-xs text-muted-foreground">Model Training</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                  <h4 className="text-sm font-semibold text-foreground">Step 3</h4>
                </div>
                <p className="text-xs text-muted-foreground">Model Validation</p>
              </div>
            </div>
            <Button onClick={handleStartTraining} iconName="Play" className="w-full">
              Start Training Pipeline
            </Button>
          </div>
        )}

        {training && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Training Progress</span>
                <span className="text-sm font-bold text-primary font-data">{trainingProgress}%</span>
              </div>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${trainingProgress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-center py-8">
              <Icon name="Loader" size={48} className="text-primary animate-spin" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Training model... This may take several minutes.
            </p>
          </div>
        )}

        {trainingResults && (
          <div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                    Training Completed Successfully
                  </h3>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Model version {trainingResults?.modelVersion} trained in {trainingResults?.trainingDuration}s
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <Icon name="Target" size={24} className="mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
                  {(trainingResults?.accuracyMetrics?.accuracy * 100)?.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <Icon name="Crosshair" size={24} className="mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
                  {(trainingResults?.accuracyMetrics?.precision * 100)?.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Precision</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <Icon name="Search" size={24} className="mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
                  {(trainingResults?.accuracyMetrics?.recall * 100)?.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Recall</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <Icon name="Award" size={24} className="mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
                  {(trainingResults?.accuracyMetrics?.f1Score * 100)?.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">F1 Score</div>
              </div>
            </div>

            {trainingResults?.optimizationSuggestions?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Optimization Suggestions</h3>
                <div className="space-y-2">
                  {trainingResults?.optimizationSuggestions?.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Icon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
                      <p className="text-xs text-foreground flex-1">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button iconName="Play" onClick={handleStartTraining}>
                Train New Model
              </Button>
              <Button variant="outline" iconName="GitBranch">
                Deploy to Production
              </Button>
              <Button variant="outline" iconName="RotateCcw">
                Rollback
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Model Validation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Validate model performance with cross-validation and test datasets
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="GitBranch" size={20} className="text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Cross-Validation</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">5-fold cross-validation for robust performance estimation</p>
            <Button size="sm" variant="outline" className="w-full">
              Run Cross-Validation
            </Button>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="TestTube" size={20} className="text-primary" />
              <h4 className="text-sm font-semibold text-foreground">A/B Testing</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Compare model versions with live traffic</p>
            <Button size="sm" variant="outline" className="w-full">
              Setup A/B Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPipelinePanel;