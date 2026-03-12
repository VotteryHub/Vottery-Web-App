import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainingDatasetPanel = ({ trainingDatasets, onRefresh }) => {
  const getQualityColor = (quality) => {
    if (quality >= 0.9) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (quality >= 0.8) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    if (quality >= 0.7) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
  };

  const getTypeIcon = (type) => {
    return type === 'labeled' ? 'CheckCircle' : 'Circle';
  };

  if (!trainingDatasets || trainingDatasets?.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Database" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No training datasets available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">Training Datasets</h2>
            <p className="text-sm text-muted-foreground">Manage and optimize fraud detection training data</p>
          </div>
          <Button iconName="Plus">
            Upload Dataset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Database" size={28} className="mx-auto text-primary mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
              {trainingDatasets?.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Datasets</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="FileText" size={28} className="mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
              {trainingDatasets?.reduce((sum, d) => sum + d?.size, 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Samples</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="CheckCircle" size={28} className="mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
              {trainingDatasets?.filter(d => d?.type === 'labeled')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Labeled Datasets</div>
          </div>
        </div>

        <div className="space-y-4">
          {trainingDatasets?.map((dataset) => (
            <div key={dataset?.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon name="Database" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground mb-1">{dataset?.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="FileText" size={12} />
                        {dataset?.size?.toLocaleString()} samples
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name={getTypeIcon(dataset?.type)} size={12} />
                        {dataset?.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        Updated {new Date(dataset?.lastUpdated)?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getQualityColor(dataset?.quality)}`}>
                  Quality: {(dataset?.quality * 100)?.toFixed(0)}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" iconName="Eye">
                  Preview
                </Button>
                <Button size="sm" variant="outline" iconName="Edit">
                  Label Data
                </Button>
                <Button size="sm" variant="outline" iconName="Download">
                  Export
                </Button>
                <Button size="sm" variant="outline" iconName="Trash2" className="text-red-600">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Data Preprocessing</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure data preprocessing workflows for optimal model training
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Filter" size={20} className="text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Data Cleaning</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle" size={12} className="text-green-600" />
                Remove duplicate entries
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle" size={12} className="text-green-600" />
                Handle missing values
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle" size={12} className="text-green-600" />
                Normalize data formats
              </li>
            </ul>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Sliders" size={20} className="text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Feature Engineering</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle" size={12} className="text-green-600" />
                Extract behavioral patterns
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle" size={12} className="text-green-600" />
                Calculate velocity metrics
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle" size={12} className="text-green-600" />
                Generate temporal features
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Data Annotation Tools</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Label false positives and train custom classifiers for improved accuracy
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" iconName="Tag" className="justify-start">
            Label False Positives
          </Button>
          <Button variant="outline" iconName="Target" className="justify-start">
            Annotate Fraud Cases
          </Button>
          <Button variant="outline" iconName="GitBranch" className="justify-start">
            Create Training Split
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainingDatasetPanel;