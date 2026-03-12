import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ModelConfigurationPanel = ({ onRefresh }) => {
  const [config, setConfig] = useState({
    algorithm: 'random_forest',
    learningRate: 0.01,
    maxDepth: 10,
    minSamplesSplit: 2,
    nEstimators: 100,
    regularization: 0.1
  });

  const algorithmOptions = [
    { value: 'random_forest', label: 'Random Forest' },
    { value: 'gradient_boosting', label: 'Gradient Boosting' },
    { value: 'neural_network', label: 'Neural Network' },
    { value: 'svm', label: 'Support Vector Machine' },
    { value: 'logistic_regression', label: 'Logistic Regression' }
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Algorithm Configuration</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Configure algorithm parameters and training settings for optimal fraud detection
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Algorithm Type</label>
            <Select
              value={config?.algorithm}
              onChange={(e) => setConfig({ ...config, algorithm: e?.target?.value })}
              options={algorithmOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Learning Rate</label>
              <Input
                type="number"
                step="0.001"
                value={config?.learningRate}
                onChange={(e) => setConfig({ ...config, learningRate: parseFloat(e?.target?.value) })}
              />
              <p className="text-xs text-muted-foreground mt-1">Controls how quickly the model adapts (0.001 - 0.1)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Max Depth</label>
              <Input
                type="number"
                value={config?.maxDepth}
                onChange={(e) => setConfig({ ...config, maxDepth: parseInt(e?.target?.value) })}
              />
              <p className="text-xs text-muted-foreground mt-1">Maximum tree depth (5 - 20)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Min Samples Split</label>
              <Input
                type="number"
                value={config?.minSamplesSplit}
                onChange={(e) => setConfig({ ...config, minSamplesSplit: parseInt(e?.target?.value) })}
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum samples required to split (2 - 10)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Number of Estimators</label>
              <Input
                type="number"
                value={config?.nEstimators}
                onChange={(e) => setConfig({ ...config, nEstimators: parseInt(e?.target?.value) })}
              />
              <p className="text-xs text-muted-foreground mt-1">Number of trees in the forest (50 - 500)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Regularization Strength</label>
            <Input
              type="number"
              step="0.01"
              value={config?.regularization}
              onChange={(e) => setConfig({ ...config, regularization: parseFloat(e?.target?.value) })}
            />
            <p className="text-xs text-muted-foreground mt-1">Prevents overfitting (0.01 - 1.0)</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button iconName="Save">
            Save Configuration
          </Button>
          <Button variant="outline" iconName="RotateCcw">
            Reset to Defaults
          </Button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Automated Optimization</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Let AI automatically optimize hyperparameters for best performance
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <Icon name="Zap" size={24} className="text-yellow-600 mb-2" />
            <h4 className="text-sm font-semibold text-foreground mb-1">Grid Search</h4>
            <p className="text-xs text-muted-foreground mb-3">Exhaustive search over parameter grid</p>
            <Button size="sm" variant="outline" className="w-full">
              Run Grid Search
            </Button>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <Icon name="Target" size={24} className="text-blue-600 mb-2" />
            <h4 className="text-sm font-semibold text-foreground mb-1">Random Search</h4>
            <p className="text-xs text-muted-foreground mb-3">Random sampling of parameter space</p>
            <Button size="sm" variant="outline" className="w-full">
              Run Random Search
            </Button>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-green-600 mb-2" />
            <h4 className="text-sm font-semibold text-foreground mb-1">Bayesian Optimization</h4>
            <p className="text-xs text-muted-foreground mb-3">Smart parameter optimization</p>
            <Button size="sm" variant="outline" className="w-full">
              Run Bayesian Opt
            </Button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Feature Selection</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select which features to include in model training
        </p>
        <div className="space-y-2">
          {[
            { name: 'Transaction Velocity', importance: 0.92 },
            { name: 'Geographic Clustering', importance: 0.87 },
            { name: 'Temporal Patterns', importance: 0.84 },
            { name: 'Behavioral Anomalies', importance: 0.79 },
            { name: 'Account Age', importance: 0.71 },
            { name: 'Device Fingerprint', importance: 0.68 },
            { name: 'IP Reputation', importance: 0.65 },
            { name: 'Transaction Amount', importance: 0.62 }
          ]?.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{feature?.name}</span>
                  <span className="text-xs text-muted-foreground">Importance: {(feature?.importance * 100)?.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${feature?.importance * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelConfigurationPanel;