import React from 'react';
import Icon from '../../../components/AppIcon';

const GeographicClusteringPanel = ({ geoData, onRefresh }) => {
  if (!geoData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No geographic clustering data available</p>
      </div>
    );
  }

  const { clusters } = geoData;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Map" size={20} className="text-primary" />
          Geographic Vote Clustering Analysis
        </h3>
        <div className="space-y-4">
          {clusters?.map((cluster, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{cluster?.region}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  cluster?.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                  cluster?.riskLevel === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {cluster?.riskLevel} risk
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Suspicious Activity</p>
                  <p className="font-medium text-foreground">{cluster?.suspiciousActivity} incidents</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Coordinates</p>
                  <p className="font-medium text-foreground">{cluster?.coordinates?.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeographicClusteringPanel;