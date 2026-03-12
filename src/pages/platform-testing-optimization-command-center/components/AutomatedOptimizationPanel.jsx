import React from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedOptimizationPanel = ({ optimizationData, onRefresh }) => {
  if (!optimizationData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No optimization data available</p>
      </div>
    );
  }

  const { recommendations, implemented, pending, effectiveness } = optimizationData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Implemented</h3>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {implemented}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Pending</h3>
            <Icon name="Clock" size={20} className="text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {pending}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Effectiveness</h3>
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">
            {effectiveness}%
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          ML-Powered Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations?.map((rec) => (
            <div key={rec?.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground">{rec?.type}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec?.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec?.priority === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {rec?.priority}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {rec?.impact} impact
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{rec?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomatedOptimizationPanel;